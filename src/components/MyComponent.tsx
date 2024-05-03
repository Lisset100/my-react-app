interface MyComponentProps {
  argument1: string;
}

export const MyComponent = (props: MyComponentProps) => {
  return <h1>{props.argument1}</h1>;
};
