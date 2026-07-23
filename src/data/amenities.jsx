// Feature/amenity key → icon + localized label. Stable English keys live in
// projectDetails.js; the icon mapping is locale-independent, labels are picked
// per active language (fall back to English). Shared by BuyProjectPage and the
// light PropertyPage so both render the same amenities from one source.
import WavesOutlined from '@mui/icons-material/WavesOutlined'
import WaterOutlined from '@mui/icons-material/WaterOutlined'
import TerrainOutlined from '@mui/icons-material/TerrainOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import GolfCourseOutlined from '@mui/icons-material/GolfCourseOutlined'
import BeachAccessOutlined from '@mui/icons-material/BeachAccessOutlined'
import SailingOutlined from '@mui/icons-material/SailingOutlined'
import PoolOutlined from '@mui/icons-material/PoolOutlined'
import HotelOutlined from '@mui/icons-material/HotelOutlined'
import SpaOutlined from '@mui/icons-material/SpaOutlined'
import FitnessCenterOutlined from '@mui/icons-material/FitnessCenterOutlined'
import RoomServiceOutlined from '@mui/icons-material/RoomServiceOutlined'
import RestaurantOutlined from '@mui/icons-material/RestaurantOutlined'
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined'
import SettingsRemoteOutlined from '@mui/icons-material/SettingsRemoteOutlined'
import ParkOutlined from '@mui/icons-material/ParkOutlined'
import DirectionsBikeOutlined from '@mui/icons-material/DirectionsBikeOutlined'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import LocalParkingOutlined from '@mui/icons-material/LocalParkingOutlined'
import VerifiedOutlined from '@mui/icons-material/VerifiedOutlined'

export const FEATURE_META = {
  seaView:           { icon: WavesOutlined,            en: 'Sea View',           ar: 'إطلالة بحرية',       ru: 'Вид на море', fa: 'ویو دریا' },
  waterfront:        { icon: WaterOutlined,            en: 'Waterfront',         ar: 'واجهة بحرية',        ru: 'Набережная', fa: 'لب آب' },
  mountainView:      { icon: TerrainOutlined,          en: 'Mountain View',      ar: 'إطلالة جبلية',       ru: 'Вид на горы', fa: 'ویو کوهستان' },
  skyViews:          { icon: VisibilityOutlined,       en: 'Sky Views',          ar: 'إطلالات سماوية',     ru: 'Панорамные виды', fa: 'ویو پانوراما' },
  golfCourse:        { icon: GolfCourseOutlined,       en: 'Golf Course',        ar: 'ملعب غولف',          ru: 'Гольф-поле', fa: 'زمین گلف' },
  beachClub:         { icon: BeachAccessOutlined,      en: 'Beach Club',         ar: 'نادٍ شاطئي',         ru: 'Пляжный клуб', fa: 'باشگاه ساحلی' },
  beachAccess:       { icon: BeachAccessOutlined,      en: 'Beach Access',       ar: 'وصول للشاطئ',        ru: 'Выход к пляжу', fa: 'دسترسی به ساحل' },
  marina:            { icon: SailingOutlined,          en: 'Marina',             ar: 'مارينا',             ru: 'Марина', fa: 'مارینا' },
  infinityPool:      { icon: PoolOutlined,             en: 'Infinity Pool',      ar: 'مسبح لا متناهٍ',     ru: 'Бассейн-инфинити', fa: 'استخر اینفینیتی' },
  pool:              { icon: PoolOutlined,             en: 'Swimming Pool',      ar: 'مسبح',               ru: 'Бассейн', fa: 'استخر' },
  privatePool:       { icon: PoolOutlined,             en: 'Private Pool',       ar: 'مسبح خاص',           ru: 'Частный бассейн', fa: 'استخر اختصاصی' },
  fiveStarHotel:     { icon: HotelOutlined,            en: '5-Star Hotel',       ar: 'فندق 5 نجوم',        ru: '5-звёздочный отель', fa: 'هتل ۵ ستاره' },
  spa:               { icon: SpaOutlined,              en: 'Spa & Wellness',     ar: 'سبا وعافية',         ru: 'Спа', fa: 'اسپا و سلامت' },
  gym:               { icon: FitnessCenterOutlined,    en: 'Fitness Centre',     ar: 'صالة لياقة',         ru: 'Фитнес-центр', fa: 'باشگاه ورزشی' },
  concierge:         { icon: RoomServiceOutlined,      en: 'Concierge',          ar: 'كونسيرج',            ru: 'Консьерж', fa: 'کانسیرژ' },
  butlerService:     { icon: RoomServiceOutlined,      en: 'Butler Service',     ar: 'خدمة الخادم الشخصي', ru: 'Сервис дворецкого', fa: 'خدمات باتلر' },
  retailDining:      { icon: RestaurantOutlined,       en: 'Retail & Dining',    ar: 'تجزئة ومطاعم',       ru: 'Магазины и рестораны', fa: 'خرید و رستوران' },
  fineDining:        { icon: RestaurantOutlined,       en: 'Fine Dining',        ar: 'مطاعم راقية',        ru: 'Высокая кухня', fa: 'رستوران‌های سطح بالا' },
  brandedResidences: { icon: WorkspacePremiumOutlined, en: 'Branded Residences', ar: 'إقامات مُوقَّعة',    ru: 'Брендированные резиденции', fa: 'اقامتگاه برنددار' },
  smartHome:         { icon: SettingsRemoteOutlined,   en: 'Smart Home',         ar: 'منزل ذكي',           ru: 'Умный дом', fa: 'خانه هوشمند' },
  landscapedGardens: { icon: ParkOutlined,             en: 'Landscaped Gardens', ar: 'حدائق منسّقة',       ru: 'Ландшафтные сады', fa: 'باغ‌های منظرسازی‌شده' },
  centralPark:       { icon: ParkOutlined,             en: 'Central Park',       ar: 'حديقة مركزية',       ru: 'Центральный парк', fa: 'پارک مرکزی' },
  cyclingPaths:      { icon: DirectionsBikeOutlined,   en: 'Cycling Paths',      ar: 'مسارات دراجات',      ru: 'Велодорожки', fa: 'مسیر دوچرخه' },
  schools:           { icon: SchoolOutlined,           en: 'Schools Nearby',     ar: 'مدارس قريبة',        ru: 'Школы рядом', fa: 'مدارس نزدیک' },
  parking:           { icon: LocalParkingOutlined,     en: 'Parking',            ar: 'مواقف سيارات',       ru: 'Парковка', fa: 'پارکینگ' },
  freehold:          { icon: VerifiedOutlined,         en: 'Freehold Ownership', ar: 'تملّك حر',           ru: 'Полная собственность', fa: 'مالکیت کامل (فری‌هولد)' },
}

export const FEATURES_HEADING = {
  en: 'Features & amenities',
  ar: 'المزايا والمرافق',
  ru: 'Особенности и удобства',
  fa: 'امکانات و ویژگی‌ها',
}
