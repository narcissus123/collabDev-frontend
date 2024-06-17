import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { SocialIcon } from "react-social-icons";

interface ChipListProps {
  chipListData: { key: number; label: string; url?: string }[];
  sx: React.CSSProperties;
}

export default function ChipList({ chipListData, sx }: ChipListProps) {
  return (
    <List
      component="ul"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        listStyle: "none",
        m: 0,
      }}
    >
      {chipListData.map((data) => (
        <ListItem key={data.key} component="li" sx={{ width: "auto", p: 0.3 }}>
          <Chip
            size="small"
            variant="outlined"
            sx={sx}
            avatar={
              data.url ? (
                <SocialIcon
                  url={data.url}
                  style={{
                    color: "green",
                    width: "1.2rem",
                    height: "1.2rem",
                    marginRight: "0px",
                  }}
                />
              ) : undefined
            }
            label={data.label}
          />
        </ListItem>
      ))}
    </List>
  );
}
