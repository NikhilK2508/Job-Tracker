# Pathway - Job Application Tracker

Ye mera submission hai Mini Hackathon ke liye. Basically ek job application
tracker hai - ek board jaisa jaha pe main dekh sakta hu maine kaha kaha apply
kiya hai, kaunsa stage chal raha hai, aur kaha follow up karna bhool gaya
(jo ki bahot baar hota hai lol).

## Ye project hi kyun banaya

Humari class me abhi tak Redux Toolkit nahi padhaya tha, to hackathon ka idea
ye tha ki jo already pata hai usi se koi cheez akele banao - JS, DOM, React,
Context API, React Router, Forms, Git/GitHub - tutorial follow kiye bina, docs
padh padh ke.

Aur waise bhi main abhi actually jobs ke liye apply kar raha hu aur bhul jata
tha ki kisse baat hui thi aur kaunsa round chal raha tha,  isliye ek aur
todo-list clone banane ki jagah maine wo cheez banayi jo mujhe khud kaam aaye.

## Jo cheeze khud se figure out karni padi

Kuch cheeze class me thik se cover nahi hui thi to docs padhne pade ya bas try
karte karte samjha:

- **Context API** - basic idea pata tha (props ko 10 level neeche pass nahi
  karna padta) but ye nahi pata tha ki provider ke andar add/edit/delete jaisi
  functions bhi kaise daalein, sirf plain state nahi. useContext ke docs
  dubara padhe aur kuch examples dekhe. Beech me ek baar sab kuch (app ka data
  + theme) ek hi context me daal diya tha aur wo bahot messy ho gaya tha to
  do alag context bana diye - ek applications ke liye, ek sirf dark/light
  mode ke liye.
- **useParams (react-router se)** - edit wale page pe pata hona chahiye ki
  konsi application kholni hai url se (`/edit/:id`). Class me sirf basic
  routes kiye the, ye wala nahi, to docs check karne pade ki useParams karta
  kya hai actually.
- **localStorage** - ye to class me tha hi nahi. Chahta tha ki refresh karne
  pe data gayab na ho lekin hackathon ke liye backend banane ka time nahi tha,
  to localStorage.setItem/getItem dhundha aur useEffect ke andar laga diya jo
  state change hote hi save kar deta hai.
- **follow up wala feature** (⏰ wala badge) - ye khud ka idea tha kyunki basic
  version bahot boring lag raha tha. Jab bhi kuch update hota hai ek timestamp
  save kar deta hu (lastUpdated), aur phir page render hote waqt "kitne din ho
  gaye" nikaal leta hu, alag se koi isStale flag rakhne ki jagah jo galat bhi
  ho sakta tha kabhi.

## Ye app karta kya hai

- Board (home page) - har application ek card ki tarah, Applied / Interview /
  Offer / Rejected me group hoke. Search box hai company ya role se dhundhne
  ke liye, aur chips hai poore column hide/show karne ke liye.
- Add page - naya application daalne ka form. Company aur role dono zaruri
  hai, aur ek check laga rakha hai ki job ka link http:// ya https:// se hi
  start ho warna save hi nahi hoga.
- Edit page - koi bhi field change kar sakte ho status samet, kitne din ho
  gaye last touch kiye hue wo dikhata hai aur agar 7+ din ho gaye ho kisi
  active wale pe to ⏰ warning bhi dikha deta hai (7 din kuch random hi rakha
  hai, bas thik laga).
- Stats page - funnel view (applied -> interview -> offer -> rejected)
  percentage ke sath, aur ek bar chart har stage ka.
- Theme toggle navbar me, dark/light, jo choose kiya wahi yaad rakhta hai.

## Class ke concepts kaha use hue

Context API context/ApplicationContext.jsx me hai (saara app data + CRUD
wala) aur context/ThemeContext.jsx me (sirf dark/light mode) - dono alag
rakhe, apne apne hook ke sath (useApplications(), useTheme()).

React Router zyada tar App.jsx me hai, total 4 routes (/, /add, /edit/:id,
/stats), edit page pe useParams aur save hone ke baad redirect karne ke liye
useNavigate.

Forms AddApplication.jsx aur EditApplication.jsx me hai, controlled inputs,
validation onBlur pe chalta hai, error text har field ke niche.

useState/useEffect to lagbhag har jagah hai form state ke liye aur dono
context ko localStorage me sync karne ke liye. useMemo bhi use kiya board pe
taki har keystroke pe poori list filter na ho jab tak search term ya filter
actually change na ho.

## Project structure

```
src/
  context/
    ApplicationContext.jsx   -> applications ka state, CRUD, localStorage, follow-up wali logic
    ThemeContext.jsx          -> dark/light mode
  components/
    Navbar.jsx                -> nav + theme toggle
    StageRail.jsx              -> har card pe wo chota progress bar
  pages/
    Dashboard.jsx              -> board / home page
    AddApplication.jsx         -> add wala form
    EditApplication.jsx        -> edit + delete wala form
    Stats.jsx                  -> funnel + bar chart
    NotFound.jsx                -> 404 page
  App.jsx                       -> routes
  main.jsx                      -> entry point
  index.css                     -> saara css
```

## Chalane ke liye

```bash
npm install
npm run dev
```

## Deploy kaise kiya (Vercel pe)

1. github pe push kiya
2. vercel.com pe import kiya, framework = Vite
3. deploy

vercel.json me ek rewrite rule daalna pada kyunki uske bina /stats jaise kisi
page pe refresh karne pe 404 aa jata tha. Samajhne me time laga ki ye
client side routing ka issue hai, mera code galat nahi tha.

## Aage jo add karna hai time mile to

- ek real backend taki data sirf ek browser me hi stuck na rahe
- asli notifications, abhi to sirf app ke andar ek badge hai
- csv export - shuru kiya tha, submission tak complete ho ya na ho pata nahi

## Honest limitations

Abhi sab kuch localStorage me hi hai. To agar browser data clear kar du ya
phone pe kholu to laptop wali applications nahi dikhengi. Hackathon ke liye
thik hai, real product ke liye nahi, lekin jitna time tha usme yehi tradeoff
lena pada.
