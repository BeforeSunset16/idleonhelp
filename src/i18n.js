import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// i18n.js 里的部分内容
const resources = {
  en: {
    translation: {
      nav: {
        game_guide: "Game Guide",
        grimoire: "Grimoire",
        weekly_boss: "Weekly Boss",
        tutorial: "Tutorial",
        quick_view: "Quick View",
        idleskiller: "Idle Skiller",
        login: "Login",
        user_center: "User Center",
        logout: "Logout",
        status_on: "Logged In",
        status_off: "Not Logged In",
      },
    },
  },
  zh: {
    translation: {
      nav: {
        game_guide: "游戏攻略",
        grimoire: "Grimoire",
        weekly_boss: "每周BOSS",
        tutorial: "新手教程",
        quick_view: "快捷查看",
        idleskiller: "Idle Skiller",
        login: "登录",
        user_center: "个人中心",
        logout: "退出登录",
        status_on: "已登录",
        status_off: "未登录",
      },
    },
  },
};

i18n
  .use(LanguageDetector) // 自动检测浏览器语言
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // 如果检测失败，默认显示英文
    interpolation: { escapeValue: false },
  });

export default i18n;
