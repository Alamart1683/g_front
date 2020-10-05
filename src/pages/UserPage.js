import React from 'react';
import { Link } from "react-router-dom";

export default function UserPage() {
  return(
    <div>
      <p>Страница пользователя</p>

      <Link to="/">Назад</Link>

    </div>
  );

}