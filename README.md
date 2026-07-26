# Pathway — Job Application Tracker

This is my submission for the Mini Hackathon. It's a job application
tracker — basically a board where I can see every job I've applied to,
what stage it's at, and whether I need to follow up on something.

## Why I picked this project

We hadn't started Redux Toolkit yet, so the challenge was to pick
something using what we'd already covered — JS, DOM, React, Context
API, React Router, Forms, Git/GitHub — and build it mostly on my own by
reading docs instead of following a tutorial video.

I'm actually applying to jobs right now, and I kept losing track of
which company I was talking to and what round I was in, so I picked
something I'd genuinely use instead of a random todo-list clone.

## What I had to figure out on my own

A few things I didn't fully remember from class and had to go check
the actual docs for:

- **Context API** — I remembered the basic idea (avoid passing props
  down manually) but I wasn't sure how to structure a provider that
  also handles CRUD functions, not just plain state. I ended up
  reading through the React docs on `useContext` again and looked at
  a couple of examples before it clicked. I also realised partway
  through that cramming *everything* into one context (both app data
  and theme) was getting messy, so I split it into two separate
  contexts instead — one for the applications, one just for
  dark/light mode.
- **React Router `useParams`** — for the edit page, I needed to know
  *which* application to show based on the URL. I'd used basic routes
  in class but not a dynamic route like `/edit/:id`. Had to check the
  React Router docs for how `useParams()` actually pulls that out.
- **localStorage** — this wasn't covered in class at all. I wanted the
  data to not disappear on refresh, but I didn't want to set up a
  whole backend for a hackathon project, so I looked up how
  `localStorage.setItem` / `getItem` work and wired it up with a
  `useEffect` that saves every time the state changes.
- **Follow-up reminder logic** — this one I came up with myself after
  the basic version felt too plain. I wanted a way to flag
  applications I'd forgotten about, so I store a timestamp
  (`lastUpdated`) every time something changes, and calculate "days
  since" on the fly whenever the app renders, instead of storing a
  separate "isStale" flag that could go out of sync.

## What the app actually does

**Board (home page)** — every application as a card, grouped into
Applied / Interview / Offer / Rejected columns. There's a search box
(filter by company or role) and filter chips to hide/show columns.

**Add page** — a form to log a new application. Company and role are
required, and I added a check so the job link has to start with
`http://` or `https://` or it won't save.

**Edit page** — change any field, including status. Shows how many
days since it was last touched, and a ⏰ warning if it's been 7+ days
on an active application (I picked 7 days somewhat arbitrarily — felt
like a reasonable "you probably forgot about this" threshold).

**Stats page** — a funnel (applied → interview → offer → rejected)
with percentages, plus a bar chart per stage.

**Theme toggle** — dark/light switch in the navbar, remembers your
choice.

## Concepts from class, and where they show up

| Concept | Where |
|---|---|
| Context API | `context/ApplicationContext.jsx` (app data + CRUD) and `context/ThemeContext.jsx` (dark/light mode) — two separate contexts, each with its own hook (`useApplications()`, `useTheme()`) |
| React Router | `App.jsx` — 4 routes (`/`, `/add`, `/edit/:id`, `/stats`), `useParams` on the edit page, `useNavigate` to redirect after saving |
| Forms | `AddApplication.jsx` / `EditApplication.jsx` — controlled inputs, validation on blur, inline error messages |
| useState / useEffect | form state, and syncing both contexts to `localStorage` |
| useMemo | used on the board to avoid re-filtering the list on every keystroke unless the search term or filters actually change |

## Project structure

```
src/
  context/
    ApplicationContext.jsx   # applications state, CRUD, localStorage, follow-up logic
    ThemeContext.jsx          # dark/light mode
  components/
    Navbar.jsx                 # nav + theme toggle button
    StageRail.jsx                 # the little progress bar on each card
  pages/
    Dashboard.jsx                 # board / home page
    AddApplication.jsx            # add form
    EditApplication.jsx           # edit + delete form
    Stats.jsx                      # funnel + bar chart
    NotFound.jsx                    # 404 page
  App.jsx                           # routes
  main.jsx                          # entry point
  index.css                         # all the styling
```

## Running it

```bash
npm install
npm run dev
```

## Deploying (Vercel)

1. Push to a GitHub repo
2. Import it on vercel.com, framework = Vite
3. Deploy

I added a `vercel.json` with a rewrite rule because without it,
refreshing on a page like `/stats` gave a 404 — took me a bit to
realize that's a client-side-routing thing and not a bug in my code.

## What I'd still like to add

- A real backend so data syncs across devices instead of being stuck
  in one browser's localStorage
- Actual notifications instead of just an in-app badge for follow-ups
- Export to CSV

## Honest limitations

Right now everything lives in `localStorage`, so if I clear my
browser data or open the site on my phone, it won't have the same
applications as my laptop. Good enough for a hackathon, not good
enough for a real product — that's the tradeoff I made to ship this
in the time I had.
