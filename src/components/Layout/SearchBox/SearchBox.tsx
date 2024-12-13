import React, { useState, useRef, useEffect } from "react";
import { TextField, useTheme, alpha, Paper, Box, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { User } from "../../../configs/types/userTypes";
import { searchUsers } from "../../../core/services/api/manage-user.api";
import { getImageUrl } from "../../../core/utils/ImageUtils/imageUtils";

const SearchBox = () => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await searchUsers(query);
      setSearchResults(response.data.data.users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  }, 300);

  const handleExpand = () => {
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    if (!inputRef.current?.value) {
      setIsFocused(false);
    }
  };

  const handleUserSelect = (user: User) => {
    console.log("Selected user:", user);
    setIsFocused(false);
    setSearchResults([]);
    setSearchQuery("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    handleSearch(newValue);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    user: User
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleUserSelect(user);
    }
  };

  return (
    <Box ref={containerRef} sx={{ position: "relative" }}>
      <TextField
        placeholder="Find Collaborator"
        variant="outlined"
        size="small"
        value={searchQuery}
        autoComplete="off"
        onChange={handleInputChange}
        sx={{
          color: theme.palette.mode === "dark" ? "white" : "grey",
          flex: 1,
        }}
        InputProps={{
          startAdornment: (
            <SearchIcon
              onClick={handleExpand}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleExpand();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Expand search"
              sx={{
                cursor: "pointer",
                color: "inherit",
                marginRight: 0.5,
              }}
            />
          ),
          sx: {
            color: "inherit",
            paddingLeft: "0.5rem",
            backgroundColor: alpha("#FFFFFF", 0.15),
            borderRadius: "20px",
            height: "2.3rem",
            transition: "width 0.5s",
            width: isFocused ? "15.5rem" : "2.3rem",
          },
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        inputRef={inputRef}
      />

      {/* Search Results Dropdown */}
      {searchResults.length > 0 && isFocused && (
        <Paper
          elevation={3}
          role="listbox"
          aria-label="Search results"
          sx={{
            position: "absolute",
            zIndex: theme.zIndex.modal,
            width: "100%",
            mt: 1,
            borderRadius: 1,
            maxHeight: "300px",
            overflow: "auto",
          }}
        >
          {searchResults.map((user) => (
            <Link
              to={`/profile/${user._id}`}
              key={user._id}
              style={{
                textDecoration: "none",
                display: "block",
              }}
            >
              <Box
                role="option"
                tabIndex={0}
                sx={{
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.primary.main, 0.15)
                        : alpha(theme.palette.primary.main, 0.05),
                  },
                  display: "flex",
                  alignItems: "center",
                  color: theme.palette.text.primary,
                  textDecoration: "none",
                }}
                onClick={() => handleUserSelect(user)}
                onKeyDown={(e) => handleKeyDown(e, user)}
                aria-selected={false}
              >
                <Avatar
                  src={user.avatar ? getImageUrl(user.avatar) : undefined}
                  alt={user.name}
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box component="span">{user.name}</Box>
              </Box>
            </Link>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default SearchBox;
