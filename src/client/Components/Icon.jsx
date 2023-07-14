import React, { useEffect, useState } from "react";

function Icon(props) {
  const { name, ...otherProps } = props;

  /* Use state hook to store icon module value */
  const [iconModule, setIconModule] = useState(null);

  useEffect(() => {
    /* Use dynamic import to get corresponding icon as a module */
    import(`../assets/${name}.svg`)
      // import(`../assets/screaming.svg`)
      .then((module) => {
        /* Persist data in state */
        setIconModule(module);
      })
      .catch((error) => {
        /* Do not forget to handle errors */
        console.error(`Icon with name: ${name} not found! error: ${error}`);
      });
  }, [name /* update on name change */]);

  const renderIcon = () => {
    if (!iconModule) return null;

    const Component = iconModule.default;

    return <Component className="Icon" {...otherProps} />;
  };

  return <>{renderIcon()}</>;
}
export default Icon;
