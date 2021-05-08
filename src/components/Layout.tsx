import {
  Box,
  Heading,
  Text,
  Icon,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  Flex,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuGroup,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { BsChevronRight, BsChevronDown } from "react-icons/bs";
import { IoIosApps } from "react-icons/io";
import { FiCircle, FiMenu } from "react-icons/fi";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { search } from "ss-search";
import MenuSearchInput, { MenuInputProps } from "./menu/MenuSearchInput";

const SERVICE_SEARCH_KEYS = ["name"];

export interface LayoutNavigation {
  title?: React.ReactElement | string;
  items: LayoutNavigationItem[];
}

export interface LayoutNavigationItem {
  icon: React.ReactElement;
  text: React.ReactElement | string;
  link: string;
  subItems?: LayoutNavigationSubItem[];
}

export interface LayoutNavigationSubItem {
  text: React.ReactElement | string;
  link: string;
}

export interface LayoutUser {
  name: string;
  picture?: string;
}

export interface LayoutService {
  name: string;
  url: string;
  logo?: string;
  group?: string;
}

export interface LayoutNavBarData {
  services: LayoutService[];
  navigations: (LayoutService | null)[];
}

const Layout: React.FC<{
  logo: React.ReactElement | string;
  navigations?: LayoutNavigation[];
  navbarData: LayoutNavBarData;
  serviceSearchInputProps?: MenuInputProps;
  user?: LayoutUser;
}> = ({
  children,
  logo,
  navigations,
  user,
  navbarData,
  serviceSearchInputProps,
}) => {
  return (
    <>
      {navigations && <Sidebar logo={logo} navigations={navigations} fixed />}

      <Navbar
        boxed={!!navigations}
        logo={logo}
        user={user}
        navigations={navigations}
        navbarData={navbarData}
        serviceSearchInputProps={serviceSearchInputProps}
      />

      <Box
        ml={["0", null, null, navigations ? "64" : "0"]}
        px="7"
        pt="24"
        minH="100vh"
      >
        <Box>{children}</Box>
      </Box>
    </>
  );
};

const Navbar: React.FC<{
  logo: React.ReactElement | string;
  navigations?: LayoutNavigation[];
  navbarData: LayoutNavBarData;
  serviceSearchInputProps?: MenuInputProps;
  user?: LayoutUser;
  boxed: boolean;
}> = ({
  boxed,
  navbarData,
  user,
  navigations,
  logo,
  serviceSearchInputProps,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [serviceSearchInput, setServiceSearchInput] = useState("");
  const [serviceItems, setServiceItems] = useState<
    Map<string, LayoutService[]> | undefined
  >();

  useEffect(() => {
    const filtered = serviceSearchInput
      ? (search(
          navbarData.services,
          SERVICE_SEARCH_KEYS,
          serviceSearchInput
        ) as LayoutService[])
      : navbarData.services;

    const groupByName = filtered.reduce(
      (acc: Map<string, LayoutService[]>, s: LayoutService) => {
        const key = s.group || "";
        const items = acc.get(key);

        if (!items) {
          return acc.set(key, [s]);
        }

        items.push(s);

        return acc.set(key, items);
      },
      new Map<string, LayoutService[]>()
    );

    setServiceItems(groupByName);
  }, [navbarData, serviceSearchInput, setServiceItems]);

  return (
    <>
      <Box
        pos="fixed"
        float="right"
        right="0"
        zIndex="dropdown"
        width={[
          "100%",
          null,
          null,
          boxed
            ? "calc(100% - var(--chakra-sizes-14) - var(--chakra-sizes-64))"
            : "100%",
        ]}
        py="2.5"
        px="5"
        mx={["0", null, null, boxed ? "7" : "0"]}
        mt={["O", null, null, boxed ? "4" : "0"]}
        bg="white"
        boxShadow="0 4px 24px 0 rgb(34 41 47 / 10%)"
        borderRadius={["0", null, null, boxed ? "6px" : "0"]}
      >
        <Flex justifyContent="space-between" alignItems="center">
          {navigations ? (
            <Box display={["inline-block", null, null, "none"]}>
              <IconButton
                ref={btnRef}
                aria-label="Sidebar"
                icon={<Icon boxSize="7" color="gray.500" as={FiMenu} />}
                variant="unstyled"
                onClick={onOpen}
              />
            </Box>
          ) : (
            <Box>
              <Heading color="primary" size="md">
                {logo}
              </Heading>
            </Box>
          )}
          <Box>
            <Menu closeOnSelect={false}>
              <MenuButton
                as={IconButton}
                aria-label="Services"
                icon={<Icon boxSize="7" as={IoIosApps} />}
                color="gray.500"
                variant="unstyled"
                _active={{ color: "primary" }}
              />
              <MenuList
                display={[null, null, "grid"]}
                gridTemplateColumns={[null, null, "repeat(3, 1fr)"]}
              >
                <MenuSearchInput
                  containerProps={{ mb: 3, gridColumn: "1/4" }}
                  onChange={(e) => setServiceSearchInput(e.target.value)}
                  {...serviceSearchInputProps}
                />

                {serviceItems &&
                  Array.from(serviceItems).map(([name, items]) => (
                    <MenuGroup key={name} title={name}>
                      {items.map(({ name, url, logo }) => (
                        <MenuItem
                          key={url}
                          as="a"
                          href={url}
                          icon={<Avatar h="6" w="6" name={name} src={logo} />}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </MenuGroup>
                  ))}
              </MenuList>
            </Menu>
          </Box>
          {user && (
            <Box>
              <Menu closeOnSelect={false}>
                <MenuButton>
                  <Avatar h="10" w="10" name={user.name} src={user.picture} />
                </MenuButton>
                <MenuList>
                  {navbarData.navigations.map((navigation, i) =>
                    navigation ? (
                      <MenuItem
                        key={navigation.url}
                        as="a"
                        href={navigation.url}
                      >
                        {navigation.name}
                      </MenuItem>
                    ) : (
                      <MenuDivider key={i} />
                    )
                  )}
                </MenuList>
              </Menu>
            </Box>
          )}
        </Flex>
      </Box>
      {navigations && (
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerBody p="0">
                <Sidebar
                  logo={logo}
                  navigations={navigations}
                  onItemLinkClick={onClose}
                />
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      )}
    </>
  );
};

const Sidebar: React.FC<{
  logo: React.ReactElement | string;
  navigations: LayoutNavigation[];
  fixed?: boolean;
  onItemLinkClick?: () => void;
}> = ({ logo, navigations, fixed, onItemLinkClick }) => {
  const { pathname } = useLocation();

  const activeIndex = useMemo(() => {
    const res = navigations
      ?.flatMap((navigation) => navigation.items)
      .reduce(
        (acc, { subItems, link }) => {
          const hasItems = subItems && subItems.length > 0;

          if (!hasItems) {
            return acc;
          }

          if (pathname.startsWith(link)) {
            return [acc[0] + 1, acc[1]];
          }

          return [-1, acc[1] + 1];
        },
        [-1, 0]
      );

    return res ? res[0] : -1;
  }, [navigations, pathname]);

  const [accordionIndex, setAccordionIndex] = useState<number | number[]>(
    activeIndex
  );

  useEffect(() => {
    setAccordionIndex(activeIndex);
  }, [activeIndex, setAccordionIndex]);

  return (
    <Box
      pos={[null, null, null, "fixed"]}
      h={[null, null, null, "100%"]}
      w={[null, null, null, "64"]}
      bgColor="white"
      boxShadow={[null, null, null, "0 0 15px 0 rgb(34 41 47 / 5%)"]}
      display={fixed ? ["none", null, null, "block"] : "block"}
    >
      <Heading color="primary" size="md" mx="5" pl="4" pr="2" mt="5">
        {logo}
      </Heading>
      <Accordion index={accordionIndex} onChange={setAccordionIndex}>
        {navigations.map(({ title, items }, i) => (
          <Box key={i} mt="5">
            {title && (
              <Text
                fontSize="sm"
                fontWeight="medium"
                textTransform="uppercase"
                color="gray"
                lineHeight="1.5"
                letterSpacing="0.01rem"
                mx="5"
                pl="4"
                pr="2"
              >
                {title}
              </Text>
            )}

            <Box as="ul" listStyleType="none" mt="3">
              {items.map(({ icon, text, link, subItems }) =>
                subItems && subItems.length > 0 ? (
                  <AccordionItem key={link} as="li" borderTop="none">
                    {({ isExpanded }) => (
                      <>
                        <Box mx="5">
                          <AccordionButton
                            py="1.5"
                            pl="4"
                            pr="2"
                            borderRadius="6px"
                            _expanded={{ bg: "blackAlpha.50" }}
                            _hover={{ pl: "5" }}
                          >
                            <Box flex="1" textAlign="left">
                              <ItemContent icon={icon} text={text} />
                            </Box>
                            {isExpanded ? (
                              <Icon
                                pos="relative"
                                top="2px"
                                fontSize="0.8rem"
                                as={BsChevronDown}
                              />
                            ) : (
                              <Icon
                                pos="relative"
                                top="2px"
                                fontSize="0.8rem"
                                as={BsChevronRight}
                              />
                            )}
                          </AccordionButton>
                        </Box>
                        <AccordionPanel
                          as="ul"
                          listStyleType="none"
                          px="0"
                          py="1.5"
                        >
                          {subItems.map(({ text, link }) => (
                            <ItemLink
                              key={link}
                              link={link}
                              pathname={pathname}
                              onClick={onItemLinkClick}
                            >
                              <Box as="span" fontSize="1.25rem">
                                <Icon fontSize="0.7rem" as={FiCircle} />
                              </Box>
                              <Text as="span" ml="3">
                                {text}
                              </Text>
                            </ItemLink>
                          ))}
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                ) : (
                  <ItemLink
                    key={link}
                    link={link}
                    pathname={pathname}
                    onClick={onItemLinkClick}
                  >
                    <ItemContent icon={icon} text={text} />
                  </ItemLink>
                )
              )}
            </Box>
          </Box>
        ))}
      </Accordion>
    </Box>
  );
};

const ItemLink: React.FC<{
  link: string;
  pathname: string;
  onClick?: () => void;
}> = ({ link, pathname, children, onClick }) => {
  const active = pathname.startsWith(link);

  return (
    <Box
      as="li"
      mx="5"
      _hover={{ pl: "1" }}
      transition="padding 0.2s"
      borderRadius="4px"
      boxShadow={active ? "0 0 10px 1px rgb(115 103 240 / 70%);" : "inherit"}
      bg={
        active
          ? "linear-gradient(118deg,#7367f0,rgba(115,103,240,.7))"
          : "inherit"
      }
      color={active ? "white" : "inherit"}
    >
      <Box
        as={Link}
        to={link}
        py="1.5"
        pl="4"
        pr="2"
        display="block"
        onClick={onClick}
      >
        {children}
      </Box>
    </Box>
  );
};

const ItemContent: React.FC<{
  icon: React.ReactElement;
  text: React.ReactElement | string;
}> = ({ icon, text }) => {
  return (
    <>
      <Box as="span" fontSize="1.25rem">
        {icon}
      </Box>
      <Text as="span" ml="3" fontWeight="normal">
        {text}
      </Text>
    </>
  );
};

export default Layout;
