import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { CreateContactDto } from './create-contact.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly mailService: MailService,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    const saved = await this.contactRepository.save(contact);
    this.logger.log(
      `New contact message from ${saved.name} (${saved.email}) saved to DB.`,
    );

    // 1. Kirim notifikasi inquiry baru ke Studio/Admin (gusari2271@gmail.com)
    this.mailService
      .sendContactInquiryNotification(saved.name, saved.email, saved.message)
      .catch((err) =>
        this.logger.error(
          'Failed to dispatch admin inquiry notification:',
          err,
        ),
      );

    // 2. Kirim tanda terima / konfirmasi otomatis ke email pengirim
    this.mailService
      .sendContactFormConfirmation(saved.email, saved.message, saved.name)
      .catch((err) =>
        this.logger.error('Failed to dispatch sender confirmation:', err),
      );

    return saved;
  }
}
