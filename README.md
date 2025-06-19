***Mysterymsg*** is a full stack application built with [Next.js](https://nextjs.org) and TypeScript. Mysterymsg allows users to create their profile which then creates their unique profile link which users can copy to send anonymous messages. The identity of people sending messages is kept entirely hidden. Another feature is **AI Integration with Gemini**. Mystermysg includes ai-generated messages with the help of google-2.0-flash model. Throughout the whole project I have used shadcn for sleek UI.


***FEATURES:***
Here's a overview of features:
- Send and receive anonymous messages
- Unique profile links for sharing
- Sender's identity stays hidden
- Authentication in sign-in is done using NextAuth.js
- Custom built sign-up flow
- Built with TypeScript for safety.
- Embedded Gemini AI model to generate/suggest messages.


🚀 **TECH STACK**
- Framework: Next.js (https://nextjs.org/)
- Language: TypeScript
- Authentication: NextAuth.js (https://next-auth.js.org/)
- UI components: shadcn (ui.shadcn.com)



📸 **SCREENSHOTS**


1.) ***Landing Page***


![Screenshot 2025-06-19 170417](https://github.com/user-attachments/assets/b2841628-0af4-4035-b734-b42c138f7b4e)



2.) ***Sign up and Sign in page***


![Screenshot 2025-06-19 170509](https://github.com/user-attachments/assets/4312fb13-9365-451c-90f2-e6db8b65d943)


![Screenshot 2025-06-19 170522](https://github.com/user-attachments/assets/226bc7be-2be8-4ada-ae93-9333461b18aa)


3.) ***User Dashboard***


![Screenshot 2025-06-19 170720](https://github.com/user-attachments/assets/70381f52-20bb-4400-9e37-d90b8a0599ef)


![Screenshot 2025-06-19 170713](https://github.com/user-attachments/assets/701ec655-0605-4680-9f81-0cbe02cf60bc)


4.) ***User's unique profile link***


![Screenshot 2025-06-19 170829](https://github.com/user-attachments/assets/a6c4a346-ccdf-4b21-8e92-98340d4871ba)


**an example of ai-generated messages**


![Screenshot 2025-06-19 170842](https://github.com/user-attachments/assets/1cd0b1e7-6d64-4a02-9ea3-f0675002f2ee)



## Getting Started

1. Clone the repository
```
git clone https://github.com/yourusername/mysterymsg.git
```

2. Install Dependencies
```
npm install
```

3. Set up environment variables
```
MONGODB_URI=""
RESEND_API_KEY=""
NEXTAUTH_SECRET=""
GEMINI_API_KEY=""
```

4.  Run the dev server
```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

