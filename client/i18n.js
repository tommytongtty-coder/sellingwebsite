import React, { createContext, useContext, useState } from 'react';

const zhHK = {
  'Market': '市場',
  'buy. sell. upgrade.': '買。賣。升級。',
  'Search GPUs, parts, or sellers': '搜尋 GPU、零件或賣家',
  'Search': '搜尋',
  'Admin Page': '管理員頁面',
  'Sell': '出售',
  'Log in': '登入',
  'Log out': '登出',
  'Language': '語言',
  'My listings': '我的商品',
  'Sign up': '註冊',
  'English': 'English',
  'Listings': '商品列表',
  'PC Parts': '電腦零件',
  'Graphics Cards': '顯示卡',
  'Hong Kong Graphics Cards': '香港顯示卡',
  'Buy and sell second-hand graphics cards in Hong Kong. Every listing includes fair market pricing so you always know the deal is worth it.':
    '在香港買賣二手顯示卡。每個商品都包含合理市場價格，讓你清楚知道是否值得入手。',
  'Active listings': '活躍商品',
  'Avg seller rating': '賣家平均評分',
  'Filters': '篩選',
  'Reset': '重設',
  'Filter + Sort': '篩選及排序',
  'Keep the listing flow local: chat first, negotiate if needed, then choose meet-up or protected payment.':
    '保持本地交易流程：先聊天，需要時議價，然後選擇面交或受保障付款。',
  'Sort by': '排序方式',
  'Most Recent': '最新',
  'Loading listings...': '正在載入商品...',
  'Save': '收藏',
  'Chat': '聊天',
  'Make Offer': '出價',
  'Price': '價格',
  'Seller': '賣家',
  'Condition': '狀況',
  'Location': '地點',
  'Deal Type': '交易方式',
  'Status': '狀態',
  'Active': '活躍',
  'New': '全新',
  'Used': '二手',
  'Open Box': '開盒',
  'Like New': '近乎全新',
  'Meet-up': '面交',
  'Delivery': '送貨',
  'Buyer Protection': '買家保障',
  'Make an offer': '出價',
  'Chat instantly': '即時聊天',
  'Keep the conversation on-platform so buyers and sellers can ask questions quickly.':
    '買賣雙方可在平台內快速提問及溝通。',
  'Let buyers negotiate the price before confirming the deal.':
    '讓買家在確認交易前議價。',
  'Meet in person': '親身交收',
  'Support local Hong Kong meet-ups for quick handoff around MTR areas.':
    '支援香港本地面交，可在港鐵站附近快速交收。',
  'Show protected listings with payment support and a refund path when eligible.':
    '顯示受保障商品，支援付款協助及符合條件時退款。',
  'All Product': '所有商品',
  'Messages': '買家',
  'All listed products in the marketplace.': '市場內所有已刊登商品。',
  'products': '件商品',
  'Product': '商品',
  'Certified?': '已認證？',
  'Waiting List': '輪候名單',
  "I'm interested! I have make a appointment to the shop.":
    '我有興趣！我已經預約到店舖查看。',
  'View the Appointment': '查看預約',
  'Reply to buyer': '回覆買家',
  'Product Detail Card': '商品詳細資料卡',
  'Product detail card': '商品詳細資料卡',
  'View and edit this product information.': '查看及編輯此商品資料。',
  'Close product details': '關閉商品詳細資料',
  'Close product detail card': '關閉商品詳細資料卡',
  'Cancel': '取消',
  'Approve': '批准',
  'Reject': '拒絕',
  'Save Changes': '儲存變更',
  'Logs': '操作紀錄',
  'Exit to site': '返回網站',
  'Search by title, seller, or ID': '以標題、賣家或編號搜尋',
  'Clear': '清除',
  'When': '時間',
  'Admin': '管理員',
  'Action': '操作',
  'Target': '目標',
  'No admin activity yet.': '尚無管理員操作紀錄。',
  'Admin sign in': '管理員登入',
  'This console is separate from your shopper account.': '此後台與你的購物帳戶分開。',
  'Username': '使用者名稱',
  'Password': '密碼',
  'Sign in': '登入',
  'Signing in...': '登入中...',
  'Shop Admin': '店舖管理員',
  'Support': '客服',
  'No messages yet.': '尚無訊息。',
  'No conversations yet': '尚無對話',
  'Write a message...': '輸入訊息...',
  'Send': '傳送',
  'Sending...': '傳送中...',
  'You': '你',
  'Description': '商品描述',
  'No photos': '沒有照片',
  'Fixed price': '固定價格',
  'Open to offers': '可議價',
  'views': '次瀏覽',
  'GPU Model': '顯示卡型號',
  'Brand': '品牌',
  'Manufacturer': '製造商',
  'VRAM': '顯示記憶體',
  'Category': '分類',
  'Quantity': '數量',
  'Pending': '待審核',
  'Draft': '草稿',
  'Sold': '已售出',
  'Rejected': '已拒絕',
};

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: (text) => text,
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (text) => {
    if (language !== 'zh-HK') return text;
    return zhHK[text] || text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
