import React from "react";
import { Select } from "antd";

const { Option } = Select;

const DropdownCountry = ({ placeholder, value, options, onChange }) => {
  return (
    <Select
      showSearch
      style={{ width: "100%" }}
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      {...{ placeholder, value, onChange }}
    >
      {options &&
        options.map((comp) => {
          const { id, name } = comp;
          return (
            <Option key={`${id}-${name}`} value={id}>
              {name}
            </Option>
          );
        })}
    </Select>
  );
};

export default DropdownCountry;
