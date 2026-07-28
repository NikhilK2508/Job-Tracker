Edited by NIKHIL KAMBLE
# Trackwel - Job Application Tracker

Ye mera submission hai Mini Hackathon ke liye. Basically ek job application
tracker hai - ek board jaisa jaha pe main dekh sakta hu maine kaha kaha apply
kiya hai, kaunsa stage chal raha hai, aur kaha follow up karna bhool gaya
(jo ki bahot baar hota hai).

## Ye project hi kyun banaya

Humari class me abhi tak Redux Toolkit nahi padhaya tha, to hackathon ka idea
ye tha ki jo already pata hai usi se koi cheez akele banao - JS, DOM, React,
Context API, React Router, Forms, Git/GitHub - tutorial follow kiye bina, docs
padh padh ke. (Redux baad me khud se add kiya, wo niche bataya hai.)

Aur waise bhi main abhi actually jobs ke liye apply kar raha hu aur bhul jata
tha ki kisse baat hui thi aur kaunsa round chal raha tha,  isliye ek aur
todo-list clone banane ki jagah maine wo cheez banayi jo mujhe khud kaam aaye.

## Jo cheeze khud se figure out karni padi

Kuch cheeze class me thik se cover nahi hui thi to docs padhne pade ya bas try
karte karte samjha:

- **Context API** - basic idea pata tha (props ko 10 level neeche pass nahi
  padta) but ye nahi pata tha ki provider ke andar add/edit/delete jaisi
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
- **Redux Toolkit** - submission ke baad add kiya kyunki dost log apne
  projects me use kar rahe the aur mujhe bhi try karna tha ki actually kitna
  alag hai Context se. Poora app Context se hi hai abhi bhi, sirf applications
  wala data (jo sabse zyada jagah se read/write hota hai - board, add form,
  edit form sab) Redux me shift kiya. createSlice se ek slice banayi,
  configureStore se store, aur localStorage me save karne ke liye
  store.subscribe() use kiya (useEffect ka jagah, kyunki redux store ke andar
  hook use nahi kar sakte). Thunks/middleware jaisa kuch nahi lagaya, sab kuch
  synchronous hi hai to jarurat nahi padi.
- **Pin/star wala feature** - jaise follow-up wala tha, ye bhi apna hi idea
  tha. Kabhi kabhi ek company sabse zyada important lagti hai (jaise dream
  company ya bahot acha offer lag raha ho) aur wo baaki cards ke beech me kahi
  niche scroll karke dhundhni padti thi. Ab har card pe ek star button hai,
  click karo to `pinned: true` ho jata hai aur wo apne column
  (Applied/Interview/Offer/Rejected) me sabse upar chali jati hai.

## Ye app karta kya hai

- Board (home page) - har application ek card ki tarah, Applied / Interview /
  Offer / Rejected me group hoke. Search box hai company ya role se dhundhne
  ke liye, aur chips hai poore column hide/show karne ke liye. Har card pe
  star icon bhi hai - important company ko pin kar do to wo column ke top pe
  aa jayegi.
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

Context API ab sirf ThemeContext.jsx me hai (sirf dark/light mode, apne
useTheme() hook ke sath). Applications wala data pehle
context/ApplicationContext.jsx me tha, ab wo store/applicationsSlice.js aur
store/store.js me chala gaya hai - ApplicationContext.jsx file abhi bhi hai
lekin ab wo bas ek chota wrapper hook hai jo andar se redux use karta hai
(`useSelector`/`useDispatch`), taki Dashboard/Add/Edit pages me kuch bhi
change na karna pade, unka `useApplications()` call karna waisa hi raha.

React Router zyada tar App.jsx me hai, total 4 routes (/, /add, /edit/:id,
/stats), edit page pe useParams aur save hone ke baad redirect karne ke liye
useNavigate.

Forms AddApplication.jsx aur EditApplication.jsx me hai, controlled inputs,
validation onBlur pe chalta hai, error text har field ke niche.

useState/useEffect ab bhi form state ke liye hai aur ThemeContext ko
localStorage me sync karne ke liye. Applications wala localStorage sync ab
useEffect ki jagah store.subscribe() se hota hai (redux store ke bahar).
useMemo bhi use kiya board pe taki har keystroke pe poori list filter na ho
jab tak search term ya filter actually change na ho.

## Project structure

```
src/
  store/
    applicationsSlice.js      -> applications ka state, CRUD, pin/unpin, follow-up wali logic
    store.js                   -> redux store + localStorage me save karne wala subscribe
  context/
    ApplicationContext.jsx    -> chota wrapper hook (useApplications), andar se redux use karta hai
    ThemeContext.jsx          -> dark/light mode
  components/
    Navbar.jsx                -> nav + theme toggle
    StageRail.jsx              -> har card pe wo chota progress bar
  pages/
    Dashboard.jsx              -> board / home page, pin button bhi yahi hai
    AddApplication.jsx         -> add wala form
    EditApplication.jsx        -> edit + delete wala form
    Stats.jsx                  -> funnel + bar chart
    NotFound.jsx                -> 404 page
  App.jsx                       -> routes
  main.jsx                      -> entry point (redux Provider yahi lagaya hai)
  index.css                     -> saara css
```

## Chalane ke liye

```bash
npm install
npm run dev
```

(Redux add karne ke baad `@reduxjs/toolkit` aur `react-redux` bhi
package.json me hai, `npm install` unko bhi le lega.)

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
- pin kiye hue applications ke liye ek alag filter chip ("Pinned only" jaisa)

## Honest limitations

Abhi sab kuch localStorage me hi hai. To agar browser data clear kar du ya
phone pe kholu to laptop wali applications nahi dikhengi. 
