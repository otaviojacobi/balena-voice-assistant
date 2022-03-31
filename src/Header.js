import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ReactComponent as BalenaIcon } from "./balena.svg";

export default function Header({ triggers }) {
  console.log(triggers);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <BalenaIcon />
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold", color: "#2A506F" }}
          >
            Assistant
          </Typography>
          <div style={{ marginLeft: "36%" }}></div>
          <Button color="inherit">REBUILD</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
