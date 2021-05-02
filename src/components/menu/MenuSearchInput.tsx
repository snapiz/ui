import {
  Box,
  Input,
  useMenuItem,
  InputProps,
  Icon,
  InputGroup,
  InputLeftElement,
  BoxProps,
} from "@chakra-ui/react";
import React from "react";
import { FiSearch } from "react-icons/fi";

const navigationKeys = ["ArrowUp", "ArrowDown", "Escape"];

export interface MenuInputProps extends InputProps {
  containerProps?: BoxProps;
}

const MenuInput: React.FC<MenuInputProps> = ({ containerProps, ...props }) => {
  const { role, ...rest } = useMenuItem(props);

  return (
    <Box {...containerProps} px="3" role={role}>
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.500" />
        </InputLeftElement>
        <Input
          {...rest}
          autoComplete="off"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (!navigationKeys.includes(e.key)) {
              e.stopPropagation();
            }
          }}
        />
      </InputGroup>
    </Box>
  );
};

export default MenuInput;
