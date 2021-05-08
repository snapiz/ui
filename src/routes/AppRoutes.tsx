import {
  Layout,
  LazyIntlProvider,
  LayoutNavigation,
  useQueryNavbarData,
} from "lib";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { FiCopy, FiServer } from "react-icons/fi";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { ROUTES } from "./constants";
import { ROUTES as FORM_ROUTES } from "./forms/constants";
import { ROUTES as FORM_ELEMENTS_ROUTES } from "./forms/elements/constants";

const translations = {
  fr: () => import("./app_fr"),
};

const FormsRoutes = React.lazy(() => import("./forms/FormsRoutes"));

const AppRoutes: React.FC = () => {
  return (
    <React.Suspense fallback={null}>
      <LazyIntlProvider ckey="app" translations={translations}>
        <Container />
      </LazyIntlProvider>
    </React.Suspense>
  );
};

const Container: React.FC = () => {
  const intl = useIntl();
  const { isLoading, data: navbarData } = useQueryNavbarData("navbarData");

  if (isLoading) {
    return <Spinner />;
  }

  if (!navbarData) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>
          <FormattedMessage
            id="layout.navbar.alertDescriptionError"
            defaultMessage="Failed to load navbar data"
          />
        </AlertDescription>
      </Alert>
    );
  }

  const navigations: LayoutNavigation[] = [
    {
      title: (
        <FormattedMessage
          id="layout.sidebar.forms.title"
          defaultMessage="Forms & tables"
        />
      ),
      items: [
        {
          icon: <Icon as={FiCopy} />,
          text: (
            <FormattedMessage
              id="layout.sidebar.forms.elements"
              defaultMessage="Form Elements"
            />
          ),
          link: FORM_ROUTES.ELEMENTS,
          subItems: [
            {
              text: (
                <FormattedMessage
                  id="layout.sidebar.forms.elements.input"
                  defaultMessage="Input"
                />
              ),
              link: FORM_ELEMENTS_ROUTES.INPUT,
            },
          ],
        },
        {
          icon: <Icon as={FiServer} />,
          text: (
            <FormattedMessage
              id="layout.sidebar.forms.table"
              defaultMessage="Table"
            />
          ),
          link: FORM_ROUTES.TABLE,
        },
      ],
    },
  ];

  return (
    <Layout
      logo={<Link to="/">Timada UI</Link>}
      navigations={navigations}
      navbarData={navbarData}
      serviceSearchInputProps={{
        placeholder: intl.formatMessage({
          id: "ui.layout.navbar.serviceSearch.title",
          defaultMessage: "Search service",
        }),
      }}
      user={{
        name: "John Doe",
        picture: "https://bit.ly/dan-abramov",
      }}
    >
      <React.Suspense fallback={null}>
        <Routes>
          <Route path="forms/*" element={<FormsRoutes />} />
          <Route path="*" element={<Navigate to={ROUTES.FORMS} replace />} />
        </Routes>
      </React.Suspense>
    </Layout>
  );
};

export default AppRoutes;
