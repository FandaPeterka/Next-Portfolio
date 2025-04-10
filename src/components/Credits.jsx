import React, { useMemo } from 'react';
import './Credits.css';

const Credits = React.memo(() => {
  const creditsList = useMemo(() => [
    {
      href: "https://www.flaticon.com/free-icons/user",
      title: "user icons",
      text: "User icons created by Freepik - Flaticon"
    },
    {
      href: "https://www.flaticon.com/free-icons/ui-design",
      title: "ui design icons",
      text: "Ui design icons created by smashingstocks - Flaticon"
    },
    {
      href: "https://www.flaticon.com/free-icons/api",
      title: "api icons",
      text: "Api icons created by Design Circle - Flaticon"
    },
    {
      href: "https://www.flaticon.com/free-icons/software-development",
      title: "software development icons",
      text: "Software development icons created by vectorsmarket15 - Flaticon"
    },
    {
      href: "https://www.flaticon.com/free-icons/server",
      title: "server icons",
      text: "Server icons created by vectorsmarket15 - Flaticon"
    },
    {
      href: "https://www.flaticon.com/free-icons/creative-knowledge",
      title: "creative knowledge icons",
      text: "Creative knowledge icons created by Vectorslab - Flaticon"
    },
    {
      href: "https://www.flaticon.com/free-icons/vr-platform",
      title: "vr platform icons",
      text: "Vr platform icons created by vectorsmarket15 - Flaticon"
    },
    {
      href: "https://www.flaticon.com/free-icons/space-shuttle",
      title: "space-shuttle icons",
      text: "Space-shuttle icons created by Hamstring - Flaticon"
    },
    {
      href: "https://www.flaticon.com/free-icons/email",
      title: "email icons",
      text: "Email icons created by flatart_icons - Flaticon"
    },
    {
      href: "https://www.flaticon.com/free-icons/video-camera",
      title: "video camera icons",
      text: "Video camera icons created by smashingstocks - Flaticon"
    },
    {
      href: "https://www.flaticon.com/free-icons/desk",
      title: "desk icons",
      text: "Desk icons created by vectorsmarket15 - Flaticon"
    },
    {
      href: "https://www.flaticon.com/free-icons/computer",
      title: "computer icons",
      text: "Computer icons created by juicy_fish - Flaticon"
    }
  ], []);

  return (
    <main className="credits-page" role="main" aria-label="Credits Page">
      <h1>Credits</h1>
      <ul>
        {creditsList.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              title={item.title}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.title}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
});

export default Credits;