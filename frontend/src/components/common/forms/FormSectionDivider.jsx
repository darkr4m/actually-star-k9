import React from "react";
import {
    Grid, 
    Divider, 
    Typography
} from "@mui/material";

export default function FormSectionDivider({children}){
    return (
        <Grid> {/* Span full width */}
            <Divider textAlign="left" sx={{ marginY: 2 }}>
                <Typography variant="overline">{children}</Typography>
            </Divider>
        </Grid>
    )
}