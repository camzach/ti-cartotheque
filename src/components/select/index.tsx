import React from "react";
import BaseSelect from "react-select";

export function Select(props: React.ComponentProps<typeof BaseSelect>) {
  return (
    <BaseSelect
      {...props}
      styles={{
        menu: (provided) => ({
          ...provided,
          margin: 0,
          // backgroundColor: 'var(--primary-light)'
        }),
        //  'control': (provided) => ({
        //    ...provided,
        //     backgroundColor: 'var(--primary-light)',
        //     borderColor: 'var(--primary-dark)'
        //  })
      }}
    />
  );
}
