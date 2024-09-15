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
import { styles } from "../styles/navbar.mui.styles.mjs";

const settings = [
  { label: "Profile", link: "profile", role: "user", icon: <AccountBoxIcon /> },
  { label: "Account", link: "account", role: "user", icon: <SettingsIcon /> },
  { label: "Logout", link: "logout", role: "user", icon: <LogoutIcon /> },
];

const pages = [
  { label: "Home", link: "home", role: "user" },
  { label: "Route", link: "route", role: "user" },
  { label: "Rules", link: "rules", role: "user" },
  {
    label: "Events",
    links: [
      { label: "Current Event", link: "event", role: "user" },
      { label: "Promotion", link: "promotion", role: "user" },
    ],
    role: "user",
  },
  { label: "Results", link: "results", role: "user" },
  { label: "Organisers", link: "organisers", role: "organiser" },
  { label: "Admin", link: "admin", role: "admin" },
];

function Navbar({ children, window: dom, user, setPageView }) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNavMenu, setAnchorElNavMenu] = useState(null);
  const [anchorElInternalNavMenu, setAnchorElInternalNavMenu] = useState(null);

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

  return (
    <HideOnScroll children={children} window={dom}>
      <AppBar>
        <Container maxWidth="xl">
          <Toolbar disableGutters={true}>
            <NavMenu
              user={user}
              anchorElNavMenu={anchorElNavMenu}
              setAnchorElNavMenu={setAnchorElNavMenu}
              anchorElInternalNavMenu={anchorElInternalNavMenu}
              setAnchorElInternalNavMenu={setAnchorElInternalNavMenu}
              setPageView={setPageView}
            />
            {user ? (
              <UserMenu
                user={user}
                anchorElUser={anchorElUser}
                setAnchorElUser={setAnchorElUser}
                setPageView={setPageView}
              />
            ) : (
              <LoginButton setPageView={setPageView} />
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

const UserMenu = memo(function UserMenu({
  user,
  anchorElUser,
  setAnchorElUser,
  setPageView,
}) {
  return (
    <Box sx={styles.userMenu.dropDown.wrapper}>
      <Tooltip title="Open settings">
        <IconButton
          onClick={(event) => handleOpenMenu(event, setAnchorElUser)}
          sx={styles.userMenu.dropDown.button}
        >
          <Avatar alt={user.firstName} src="/" />
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
      >
        {settings.map((setting) => (
          <MenuItem
            key={setting.link}
            onClick={() => {
              setAnchorElUser(null);
              setPageView(setting.link);
            }}
          >
            <ListItemIcon>{setting.icon}</ListItemIcon>
            <Typography sx={styles.userMenu.dropDown.items}>
              {setting.label}
            </Typography>
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
  setPageView,
}) {
  // causes an addition rerender on page launch (acceptable)
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
          setPageView={setPageView}
        />
      ) : null}
      <LandscapeIcon sx={styles.navMenu.logo} />
      <Typography
        variant="h5"
        noWrap
        component="span"
        onClick={() => {
          setPageView("home");
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
          setPageView={setPageView}
        />
      )}
    </>
  );
});

function LoginButton({ setPageView }) {
  return (
    <Box sx={styles.login.wrapper}>
      <Button
        key="login"
        sx={styles.login.button}
        onClick={() => {
          setPageView("login");
        }}
      >
        Login
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
  setPageView,
}) {
  return (
    <Box sx={styles.navMenu.dropDown.wrapper}>
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={(event) => handleOpenMenu(event, setAnchorElNavMenu)}
        color="inherit"
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
      >
        {pages.map((page) => {
          if (page.link && shouldUserViewPage(user.role, page.role)) {
            return (
              <MenuItem
                key={page.link}
                onClick={() => {
                  setAnchorElNavMenu(null);
                  setPageView(page.link);
                }}
              >
                <Typography sx={styles.navMenu.dropDown.items}>
                  {page.label}
                </Typography>
              </MenuItem>
            );
          } else if (page.links && shouldUserViewPage(user.role, page.role)) {
            return (
              <MenuItem key={page.label.toLowerCase()}>
                <Box sx={styles.navMenu.dropDown.wrapper}>
                  <IconButton
                    onClick={(event) =>
                      handleOpenInternalNavMenu(
                        event,
                        page.label.toLowerCase(),
                        setAnchorElInternalNavMenu
                      )
                    }
                    sx={styles.navMenu.dropDown.button}
                  >
                    <Typography sx={styles.navMenu.dropDown.items}>
                      {page.label}
                    </Typography>
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
                    open={
                      anchorElInternalNavMenu?.button ===
                      page.label.toLowerCase()
                    }
                    onClose={() => {
                      setAnchorElInternalNavMenu(null);
                      setAnchorElNavMenu(null);
                    }}
                  >
                    {page.links.map((link) => (
                      <MenuItem
                        key={link.link}
                        onClick={() => {
                          setAnchorElInternalNavMenu(null);
                          setAnchorElNavMenu(null);
                          setPageView(link.link);
                        }}
                      >
                        <Typography sx={styles.navMenu.dropDown.items}>
                          {link.label}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
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
  setPageView,
}) {
  return (
    <Box sx={styles.navMenu.itemList.wrapper}>
      {pages.map((page) => {
        if (page.link) {
          return (
            <Button
              key={page.link}
              onClick={() => setPageView(page.link)}
              sx={styles.navMenu.itemList.button}
            >
              {page.label}
            </Button>
          );
        } else if (page.links) {
          return (
            <span key={page.label.toLowerCase()}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={(event) =>
                  handleOpenInternalNavMenu(
                    event,
                    page.label.toLowerCase(),
                    setAnchorElInternalNavMenu
                  )
                }
                color="inherit"
              >
                <Typography
                  sx={{ ...styles.navMenu.itemList.button, fontSize: 14 }}
                >
                  {page.label.toUpperCase()}
                </Typography>
                <ArrowDropDownIcon
                  sx={{ ...styles.navMenu.itemList.button, mr: -1.5 }}
                />
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
                open={
                  anchorElInternalNavMenu?.button === page.label.toLowerCase()
                }
                onClose={() => setAnchorElInternalNavMenu(null)}
                sx={{ ...styles.navMenu.dropDown.list, mt: -2, ml: 1 }}
              >
                {page.links.map((link) => {
                  if (link.link && shouldUserViewPage(user.role, link.role)) {
                    return (
                      <MenuItem
                        key={link.link}
                        onClick={() => {
                          setAnchorElInternalNavMenu(null);
                          setPageView(link.link);
                        }}
                      >
                        <Typography sx={styles.navMenu.dropDown.items}>
                          {link.label}
                        </Typography>
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

const handleOpenInternalNavMenu = (
  event,
  button,
  setAnchorElInternalNavMenu
) => {
  setAnchorElInternalNavMenu({
    event: event.currentTarget,
    button: button,
  });
};

const shouldUserViewPage = (userRole, pageRestriction) => {
  const roles = ["admin", "organiser", "user"];

  return roles.indexOf(userRole) <= roles.indexOf(pageRestriction);
};

export default Navbar;
