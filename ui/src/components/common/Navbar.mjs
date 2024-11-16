"use client";

import { useState, useEffect, memo } from "react";
import {
  MenuItem,
  Toolbar,
  Tooltip,
  Button,
  Avatar,
  Container,
  Menu,
  Typography,
  IconButton,
  Box,
  AppBar,
  Slide,
  useScrollTrigger,
  useMediaQuery,
  ListItemIcon,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Landscape as LandscapeIcon,
  ArrowDropDown as ArrowDropDownIcon,
  AccountBox as AccountBoxIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { styles } from "../../styles/navbar.mui.styles.mjs";
import { USER_ROLES, USER_ROLES_IN_ORDER_OF_PRECEDENCE } from "@/src/lib/constants.mjs";
import { handleSignOut } from "@/src/lib/cognitoActions.mjs";
import { toast } from "react-toastify";

import useAuthUser from "@/src/app/hooks/use-auth-user";

const pages = [
  { label: "Home", link: "/", role: USER_ROLES.GUEST },
  {
    label: "Event",
    links: [
      { label: "Current Event", link: "/event/current", role: USER_ROLES.GUEST },
      { label: "Route", link: "/event/route", role: USER_ROLES.GUEST },
      { label: "Rules", link: "/event/rules", role: USER_ROLES.GUEST },
      { label: "Results", link: "/event/results", role: USER_ROLES.GUEST },
      { label: "Promotion", link: "/event/promotion", role: USER_ROLES.GUEST },
    ],
    role: USER_ROLES.GUEST,
  },
  { label: "Organisers", link: "/organiser", role: USER_ROLES.ORGANISER },
  { label: "Admin", link: "/admin", role: USER_ROLES.ADMIN },
];

function Navbar({ children, window: dom }) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNavMenu, setAnchorElNavMenu] = useState(null);
  const [anchorElInternalNavMenu, setAnchorElInternalNavMenu] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setAnchorElUser((previousStateValue) => {
        return previousStateValue !== null ? null : previousStateValue;
      });

      setAnchorElNavMenu((previousStateValue) => {
        return previousStateValue !== null ? null : previousStateValue;
      });

      setAnchorElInternalNavMenu((previousStateValue) => {
        return previousStateValue !== null ? null : previousStateValue;
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const user = useAuthUser();

  return (
    <HideOnScroll children={children} window={dom}>
      <AppBar data-cy="navbar">
        <Container maxWidth="xl">
          <Toolbar disableGutters={true}>
            <NavMenu
              user={user}
              anchorElNavMenu={anchorElNavMenu}
              setAnchorElNavMenu={setAnchorElNavMenu}
              anchorElInternalNavMenu={anchorElInternalNavMenu}
              setAnchorElInternalNavMenu={setAnchorElInternalNavMenu}
              router={router}
            />
            {user?.role === USER_ROLES.GUEST ? (
              <SignInButton router={router} />
            ) : (
              <UserMenu user={user} anchorElUser={anchorElUser} setAnchorElUser={setAnchorElUser} router={router} />
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}

function HideOnScroll({ children, window }) {
  const trigger = useScrollTrigger({
    target: window,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
}

const UserMenu = memo(function UserMenu({ user, anchorElUser, setAnchorElUser, router }) {
  const [isLoadingSignOut, setIsLoadingSignOut] = useState(false);

  const settings = [
    { label: "Profile", link: "/user/profile", role: USER_ROLES.USER, icon: <AccountBoxIcon /> },
    { label: "Account", link: "/user/account", role: USER_ROLES.USER, icon: <SettingsIcon /> },
    {
      label: "Sign Out",
      function: async () => {
        try {
          setIsLoadingSignOut(true);
          await handleSignOut();
        } catch (error) {
          console.error(new Error("Failed to sign you out", { cause: error }));
          toast.error("Failed to sign you out");
        } finally {
          setIsLoadingSignOut(false);
        }
      },
      role: USER_ROLES.USER,
      icon: <LogoutIcon />,
      isLoadingState: isLoadingSignOut,
    },
  ];

  return (
    <Box data-cy="user-settings" sx={styles.userMenu.dropDown.wrapper}>
      <Tooltip title="Open settings">
        <IconButton
          onClick={(event) => handleOpenMenu(event, setAnchorElUser)}
          sx={styles.userMenu.dropDown.button}
          data-cy="button"
        >
          <Avatar alt={user?.firstName} src="/" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={styles.userMenu.dropDown.list}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={() => setAnchorElUser(null)}
        slotProps={styles.userMenu.dropDown.arrow}
        data-cy="user-settings-dropdown"
      >
        {settings.map((setting) => (
          <MenuItem
            data-cy={`user-settings-dropdown-${setting.link}`}
            key={setting.label}
            onClick={async () => {
              setAnchorElUser(null);
              if (setting.link) {
                router.push(setting.link);
              }
              if (setting.function) {
                await setting.function();
              }
            }}
            disabled={setting.isLoadingState}
          >
            <ListItemIcon>{setting.icon}</ListItemIcon>
            <Typography sx={styles.userMenu.dropDown.items}>{setting.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
});

const NavMenu = memo(function NavMenu({
  user,
  anchorElNavMenu,
  setAnchorElNavMenu,
  anchorElInternalNavMenu,
  setAnchorElInternalNavMenu,
  router,
}) {
  // i think this causes an addition rerender on page launch (acceptable)
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <>
      {isSmallScreen ? (
        <SmallPageNavBarMenu
          anchorElNavMenu={anchorElNavMenu}
          setAnchorElNavMenu={setAnchorElNavMenu}
          anchorElInternalNavMenu={anchorElInternalNavMenu}
          setAnchorElInternalNavMenu={setAnchorElInternalNavMenu}
          user={user}
          router={router}
        />
      ) : null}
      <LandscapeIcon sx={styles.navMenu.logo} data-cy="logo" />
      <Typography
        data-cy="title"
        variant="h5"
        noWrap
        component="span"
        onClick={() => {
          router.push("home");
        }}
        sx={styles.navMenu.title}
      >
        Y3P
      </Typography>
      {isSmallScreen ? null : (
        <LargePageNavBarMenu
          user={user}
          anchorElInternalNavMenu={anchorElInternalNavMenu}
          setAnchorElInternalNavMenu={setAnchorElInternalNavMenu}
          router={router}
        />
      )}
    </>
  );
});

function SignInButton({ router }) {
  return (
    <Box sx={styles.signIn.wrapper}>
      <Button
        data-cy="signIn-button"
        key="signIn"
        sx={styles.signIn.button}
        onClick={() => {
          router.push("/auth/sign-in");
        }}
      >
        Sign In
      </Button>
    </Box>
  );
}

const SmallPageNavBarMenu = memo(function SmallPageNavBarMenu({
  user,
  anchorElNavMenu,
  setAnchorElNavMenu,
  anchorElInternalNavMenu,
  setAnchorElInternalNavMenu,
  router,
}) {
  return (
    <Box data-cy="small-nav-menu" sx={styles.navMenu.dropDown.wrapper}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={(event) => handleOpenMenu(event, setAnchorElNavMenu)}
        color="inherit"
        data-cy="button"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNavMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElNavMenu)}
        onClose={() => setAnchorElNavMenu(null)}
        sx={styles.navMenu.dropDown.list}
        data-cy="small-nav-menu-dropdown"
      >
        {pages.map((page) => {
          if (page.link && shouldUserViewPage(user?.role, page.role)) {
            return (
              <MenuItem
                data-cy={`${page.link}`}
                key={page.link}
                onClick={() => {
                  setAnchorElNavMenu(null);
                  router.push(page.link);
                }}
              >
                <Typography sx={styles.navMenu.dropDown.items}>{page.label}</Typography>
              </MenuItem>
            );
          } else if (page.links && shouldUserViewPage(user?.role, page.role)) {
            return (
              <MenuItem
                key={page.label.toLowerCase()}
                data-cy={`${page.label.toLowerCase()}`}
                sx={styles.navMenu.dropDown.wrapper}
              >
                <IconButton
                  data-cy={`button`}
                  onClick={(event) =>
                    handleOpenInternalNavMenu(event, page.label.toLowerCase(), setAnchorElInternalNavMenu)
                  }
                  sx={styles.navMenu.dropDown.button}
                >
                  <Typography sx={styles.navMenu.dropDown.items}>{page.label}</Typography>
                  <ArrowDropDownIcon />
                </IconButton>
                <Menu
                  sx={styles.navMenu.dropDown.internalList}
                  id="menu-appbar"
                  anchorEl={anchorElInternalNavMenu?.event}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={anchorElInternalNavMenu?.button === page.label.toLowerCase()}
                  onClose={() => {
                    setAnchorElInternalNavMenu(null);
                    setAnchorElNavMenu(null);
                  }}
                  data-cy={`${page.label.toLowerCase()}-dropdown`}
                >
                  {page.links.map((link) => (
                    <MenuItem
                      data-cy={`${page.label.toLowerCase()}-dropdown-${link.link}`}
                      key={link.link}
                      onClick={() => {
                        setAnchorElInternalNavMenu(null);
                        setAnchorElNavMenu(null);
                        router.push(link.link);
                      }}
                    >
                      <Typography sx={styles.navMenu.dropDown.items}>{link.label}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </MenuItem>
            );
          }
        })}
      </Menu>
    </Box>
  );
});

const LargePageNavBarMenu = memo(function LargePageNavBarMenu({
  user,
  anchorElInternalNavMenu,
  setAnchorElInternalNavMenu,
  router,
}) {
  return (
    <Box data-cy="large-nav-menu" sx={styles.navMenu.itemList.wrapper}>
      {pages.map((page) => {
        if (page.link && shouldUserViewPage(user?.role, page.role)) {
          return (
            <Button
              data-cy={`${page.link}`}
              key={page.link}
              onClick={() => router.push(page.link)}
              sx={styles.navMenu.itemList.button}
            >
              {page.label}
            </Button>
          );
        } else if (page.links) {
          return (
            <span key={page.label.toLowerCase()} data-cy={`${page.label.toLowerCase()}`}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(event) =>
                  handleOpenInternalNavMenu(event, page.label.toLowerCase(), setAnchorElInternalNavMenu)
                }
                color="inherit"
                data-cy="button"
              >
                <Typography sx={{ ...styles.navMenu.itemList.button, fontSize: 14 }}>
                  {page.label.toUpperCase()}
                </Typography>
                <ArrowDropDownIcon sx={{ ...styles.navMenu.itemList.button, mr: -1.5 }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElInternalNavMenu?.event}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={anchorElInternalNavMenu?.button === page.label.toLowerCase()}
                onClose={() => setAnchorElInternalNavMenu(null)}
                sx={{ ...styles.navMenu.dropDown.list, mt: -2, ml: 1 }}
                data-cy={`${page.label.toLowerCase()}-dropdown`}
              >
                {page.links.map((link) => {
                  if (link.link && shouldUserViewPage(user?.role, link.role)) {
                    return (
                      <MenuItem
                        key={link.link}
                        data-cy={`${page.label.toLowerCase()}-dropdown-${link.link}`}
                        onClick={() => {
                          setAnchorElInternalNavMenu(null);
                          router.push(link.link);
                        }}
                      >
                        <Typography sx={styles.navMenu.dropDown.items}>{link.label}</Typography>
                      </MenuItem>
                    );
                  }
                })}
              </Menu>
            </span>
          );
        }
      })}
    </Box>
  );
});

const handleOpenMenu = (event, setter) => {
  setter(event.currentTarget);
};

const handleOpenInternalNavMenu = (event, button, setAnchorElInternalNavMenu) => {
  setAnchorElInternalNavMenu({
    event: event.currentTarget,
    button: button,
  });
};

const shouldUserViewPage = (userRole, pageRestriction) => {
  if (!userRole) {
    userRole = USER_ROLES.GUEST;
  }

  return (
    USER_ROLES_IN_ORDER_OF_PRECEDENCE.indexOf(userRole) <= USER_ROLES_IN_ORDER_OF_PRECEDENCE.indexOf(pageRestriction)
  );
};

export default Navbar;
