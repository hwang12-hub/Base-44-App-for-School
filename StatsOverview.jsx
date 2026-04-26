@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-inter: 'Inter', sans-serif;
    --background: 240 20% 98%;
    --foreground: 240 10% 10%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 10%;
    --primary: 252 56% 57%;
    --primary-foreground: 0 0% 100%;
    --secondary: 240 15% 95%;
    --secondary-foreground: 240 10% 20%;
    --muted: 240 10% 94%;
    --muted-foreground: 240 5% 46%;
    --accent: 38 92% 60%;
    --accent-foreground: 38 90% 15%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 10% 90%;
    --input: 240 10% 90%;
    --ring: 252 56% 57%;
    --chart-1: 252 56% 57%;
    --chart-2: 38 92% 60%;
    --chart-3: 160 60% 45%;
    --chart-4: 340 65% 55%;
    --chart-5: 200 70% 50%;
    --radius: 0.75rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 252 56% 57%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 252 56% 57%;
  }

  .dark {
    --background: 240 10% 6%;
    --foreground: 0 0% 95%;
    --card: 240 10% 9%;
    --card-foreground: 0 0% 95%;
    --popover: 240 10% 9%;
    --popover-foreground: 0 0% 95%;
    --primary: 252 56% 62%;
    --primary-foreground: 0 0% 100%;
    --secondary: 240 10% 14%;
    --secondary-foreground: 0 0% 95%;
    --muted: 240 10% 14%;
    --muted-foreground: 240 5% 55%;
    --accent: 38 92% 55%;
    --accent-foreground: 38 90% 95%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 10% 18%;
    --input: 240 10% 18%;
    --ring: 252 56% 62%;
    --chart-1: 252 56% 62%;
    --chart-2: 38 92% 55%;
    --chart-3: 160 60% 50%;
    --chart-4: 340 65% 60%;
    --chart-5: 200 70% 55%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 252 56% 62%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 252 56% 62%;
  }
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground font-inter;
  }
}