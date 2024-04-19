import React from 'react';

interface WelcomeProps {
  nombre: string;
}

const Welcome: React.FC<WelcomeProps> = (props) => {
  console.log("props:", props.nombre);
  return (
    <h1>
      Hola soy {props.nombre}
    </h1>
  );
};

export default Welcome;