import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang: WritableSignal<'en' | 'zh'> = signal('en');

  toggleLanguage() {
    this.currentLang.update(lang => lang === 'en' ? 'zh' : 'en');
  }

  setLanguage(lang: 'en' | 'zh') {
    this.currentLang.set(lang);
  }

  // Simple dictionary
  private dictionary: Record<string, { en: string; zh: string }> = {
    'nav.manifestation': { en: 'manifestation', zh: '宣言 / 表达' },
    'nav.aboutUs': { en: 'about us', zh: '关于我们' },
    'nav.news': { en: 'news', zh: '新闻动态' },
    'nav.career': { en: 'career', zh: '招贤纳士' },
    'nav.contactUs': { en: 'contact us', zh: '联系我们' },
    'explore.lang': { en: 'Explore in:', zh: '探索语言:' },
    'contact.name': { en: 'Name', zh: '姓名' },
    'contact.email': { en: 'Email', zh: '电子邮箱' },
    'contact.message': { en: 'Message', zh: '留言内容' },
    'contact.submit': { en: 'Submit Inquiry', zh: '提交咨询' },
    'contact.submitting': { en: 'Sending...', zh: '发送中...' },
    'contact.success': { en: 'Thank you. Your message has been received.', zh: '谢谢。我们已收到您的留言。' },
    'contact.error': { en: 'Failed to send message. Please try again.', zh: '发送失败，请稍后重试。' },
    'project.location': { en: 'Location', zh: '项目地点' },
    'project.year': { en: 'Year', zh: '设计年份' },
    'project.category': { en: 'Category', zh: '项目类型' },
    'project.back': { en: 'Back to Field', zh: '返回网格' },
    'manifestation.title': { en: 'Manifestation', zh: '设计宣言' },
    'about.title': { en: 'About the Studio', zh: '关于工作室' },
    'news.title': { en: 'News & Media', zh: '新闻与媒体' },
    'career.title': { en: 'Career Opportunities', zh: '职业发展' },
  };

  translate(key: string): string {
    const entry = this.dictionary[key];
    if (!entry) return key;
    return entry[this.currentLang()];
  }
}
