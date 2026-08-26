export const LOGO = '/bazram-logo.webp'

export const IMAGES = {
  arrive: 'https://yamchatime.com/wp-content/uploads/2026/03/A-unique-Ramadan-experience-at-Bazram-Merdeka-at-Stadium-Merdeka.jpg',
  gather: 'https://yamchatime.com/wp-content/uploads/2026/03/PNB-Merdeka-hosts-its-first-ever-Bazaar-Ramadan-at-Stadium-Merdeka-1-1024x681.jpg',
  food: 'https://yamchatime.com/wp-content/uploads/2026/03/PNB-Merdeka-hosts-its-first-ever-Bazaar-Ramadan-at-Stadium-Merdeka--1024x607.jpg',
  break: 'https://www.warisankl.my/clients/asset_30783ACB-EA95-446E-8A11-9AC9134F0D37/contentMS/img/P5A%20(1).jpg',
  stands: '/img/stands-crowd.jpg',
  poster: '/img/poster.jpg',
}

export const IMAGE_SIZE = {
  [IMAGES.arrive]: [846, 564],
  [IMAGES.gather]: [1024, 681],
  [IMAGES.food]: [1024, 607],
  [IMAGES.break]: [1400, 933],
  [IMAGES.stands]: [576, 576],
  [IMAGES.poster]: [640, 640],
}

export const WHATSAPP = 'https://wa.me/60164597091?text=Hi%202Cool%20Productions%2C%20saya%20berminat%20untuk%20book%20tapak%20Bazram%20Merdeka.%20Boleh%20share%20details%20vendor%3F'

export const INSTAGRAM = 'https://www.instagram.com/bazrammerdeka/'

export const EVENT = {
  name: 'Bazram Merdeka',
  place: 'Stadium Merdeka, Kuala Lumpur',
  dates: '21 Feb – 18 Mar 2026',
  hours: '4 PM – 11 PM',
  entry: 'Free entry',
}

export const NAV_LINKS = [
  ['/iftar', 'The Iftar Hour'],
  ['/food', 'Food'],
  ['/programme', 'Programme'],
  ['/visit', 'Visit'],
]

export const SCENES = [
  { id: 'arrive', time: '4:00 PM', word: 'Arrive' },
  { id: 'wander', time: '5:00 PM', word: 'Wander' },
  { id: 'gather', time: 'Before Maghrib', word: 'Gather' },
  { id: 'break', time: 'Maghrib', word: 'Break' },
  { id: 'stay', time: 'Until 11 PM', word: 'Stay' },
]

export const FOODS = [
  {
    id: 'hot',
    name: 'Hot food',
    line: 'Grills, rice dishes and the smoky classics.',
    copy: 'Follow the smoke. Skewers over charcoal, bubbling pots and the kind of plates worth queueing for.',
    crop: 'right',
  },
  {
    id: 'sweet',
    name: 'Sweet',
    line: 'Kuih, chilled desserts and something for after Maghrib.',
    copy: 'Vendors lay the sweets out by hand as the evening approaches. Take a box to share on the field.',
    crop: 'center',
  },
  {
    id: 'drinks',
    name: 'Drinks',
    line: 'Cold, sweet and iced for the walk in.',
    copy: 'Sugarcane, iced tea, coffee and the pink cups everyone photographs. Bring two — one never survives the walk.',
    crop: 'left',
  },
  {
    id: 'trucks',
    name: 'Food trucks',
    line: 'Street-food formats parked around the bowl.',
    copy: 'A second round lives at the trucks. Wander, compare, and save room for later — the night is long.',
    crop: 'field',
  },
]

export const PROGRAMME = [
  ['4:00 PM', 'Bazaar opens', 'Gates open and the food lanes come alive. Come early for the full pick of the bazaar.'],
  ['Before Maghrib', 'Wander & gather', 'Browse the stalls, grab a mat and find your place on the field with friends and family.'],
  ['Maghrib', 'The whole stadium pauses', 'Thousands break fast together as the sun sets over the pitch. The moment the evening is built around.'],
  ['After iftar', 'Prayer & the night market mood', 'Prayer facilities on site, the stalls re-open, and the evening carries on around the stadium.'],
  ['11:00 PM', 'Home time', 'The lights dim, the last drinks are poured and the field empties out into the KL night.'],
]

export const VISIT_FACTS = [
  ['Dates', EVENT.dates],
  ['Hours', EVENT.hours],
  ['Location', 'Stadium Merdeka'],
  ['Entry', 'Free'],
]

export const VISIT_NOTES = [
  {
    id: 'getting-here',
    title: 'Getting here',
    copy: 'Merdeka MRT and Maharajalela Monorail both drop you at the stadium precinct. Follow the crowd from Gerbang Utama, the main gate.',
  },
  {
    id: 'prayer',
    title: 'Prayer',
    copy: 'A prayer room sits inside the grounds, marked on the site map, with Masjid Al-Bukhari Foundation a short walk away. Give yourself time before Maghrib.',
  },
  {
    id: 'families',
    title: 'Families',
    copy: 'The field is a picnic. Mats, prams and big groups are part of the evening — children should stay supervised near the track.',
  },
  {
    id: 'rules',
    title: 'House rules',
    copy: 'No smoking or vaping, no pets, no littering and no flammable materials. Stadium restrictions apply throughout.',
  },
]
