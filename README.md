# 📸 NgSignalsPexelsApp

**NgSignalsPexelsApp** is an Angular project (generated with **Angular CLI v17.0.1**) that integrates the **Pexels API** and leverages **Angular Signals** to practice and demonstrate modern reactive programming techniques in Angular.

---

## Quick tutorial

![Quick tutorial](https://github.com/ShadowDrake21/ng-signals-pexels-app/raw/main/src/assets/readme-gif.gif)

## 🧠 Overview

This project serves as a sandbox to explore **Angular Signals**, **state management**, and **API integration** with real-world media content from **Pexels**.  
Users can browse, search, and manage favorite photos and videos — all while experimenting with Angular’s new reactivity model.

---

## 🚀 Features

- 🔐 **Authentication options** — sign in, sign up, or explore as a guest  
- 🖼️ **Photo & video browsing** via **Pexels API**  
- 🔍 **Search functionality** for media content  
- ❤️ **Add / remove favorites** (requires authenticated user)  
- 🧭 **Reactive UI** powered by **Angular Signals**  
- ⚙️ **Modular structure** for scalability and experimentation

---

## ⚠️ Important Note

> All API secrets and credentials have been **removed** from the repository for security reasons.  
> To run the app properly, you must provide your own **Pexels API credentials** inside the `/src/environments` folder.

Example environment file:

```ts
export const environment = {
  production: false,
  pexelsApiKey: 'YOUR_PEXELS_API_KEY_HERE'
};
```
🧭 How to Use the App
Sign in, sign up, or continue as a guest.

Guest users can explore content but cannot save favorites.

Browse or search for photos and videos.

Add or remove favorites using the UI controls.

Experiment with Angular Signals — watch how state changes propagate reactively through the app!

🧰 Tech Stack
Angular 17

Angular Signals

TypeScript

Pexels API

Firebase Authentication (optional)

SCSS / TailwindCSS (optional)

⚙️ Development
Run the App Locally

ng serve
Then open: http://localhost:4200/
The application will automatically reload when files change.

Generate Components
ng generate component component-name
You can also generate directives, pipes, services, guards, and more:

ng generate directive|pipe|service|class|guard|interface|enum|module
Build for Production

ng build
Build artifacts are stored in the dist/ directory.

🧪 Testing
Unit Tests
Run unit tests via Karma:

bash
Skopiuj kod
ng test
End-to-End Tests
Run e2e tests:

ng e2e
You may need to install a compatible e2e testing package first.

💡 Additional Resources
For detailed help with Angular CLI commands, check out the official documentation:
👉 Angular CLI Overview and Command Reference

🌱 Future Improvements
Add infinite scroll for media browsing

Introduce user albums or collections

Integrate pagination and lazy loading

Support dark/light themes

Add SSR (Angular Universal) for SEO

👨‍💻 Author
NgSignalsPexelsApp — a practical exploration of modern Angular reactivity and real API integration using Pexels.
