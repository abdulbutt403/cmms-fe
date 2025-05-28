"use client"
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Avatar,
  Paper,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import {
  Inventory,
  Security,
  LocationOn,
  Schedule,
  Build,
  Description,
} from "@mui/icons-material";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../api/api";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease-in-out",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
  },
}));

const GradientCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  borderRadius: 20,
  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
  width: "100%",
}));

const PartImage = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 400,
  borderRadius: 16,
  background: "linear-gradient(45deg, #f0f2f5, #e1e5e9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/placeholder.svg?height=400&width=600") center/cover',
    borderRadius: 16,
  },
}));

const InfoField = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  background: "linear-gradient(145deg, #ffffff, #f8f9fa)",
  border: "1px solid #e9ecef",
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: "#667eea",
    transform: "translateY(-1px)",
  },
}));

const StatusCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  color: "white",
  borderRadius: 16,
  padding: theme.spacing(2),
  width: "100%",
}));

const SpecItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1.5, 0),
  borderBottom: "1px solid #f0f0f0",
  "&:last-child": {
    borderBottom: "none",
  },
}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ViewParts() {
  const { id } = useParams();
  const [partData, setPartData] = useState(null);

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const res = await api.get(`/parts/${id}`);
        if (res.data.success) {
          setPartData(res.data.data);
        } else {
          toast.error("Failed to fetch part details");
        }
      } catch (err) {
        console.error("Error fetching part:", err);
        toast.error("Error fetching part");
      }
    };
    if (id) {
      fetchPart();
    }
  }, [id]);

  if (!partData) {
    return <Typography>Loading...</Typography>;
  }

  const qrData = JSON.stringify({
    name: partData.partName,
    id: partData._id,
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        fontFamily: "Poppins, sans-serif",
        p: { xs: 2, md: 4 },
      }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Box maxWidth="1400px" mx="auto">
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} lg={6}>
              <Stack spacing={3} sx={{ width: "100%" }}>
                {/* Part Image (Photo Section) */}
                <motion.div variants={itemVariants}>
                  <StyledCard>
                    <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, color: "#2c3e50", mb: 2 }}
                      >
                        Part Photo
                      </Typography>
                      <PartImage sx={{ flexGrow: 1 }} />
                      <Typography
                        variant="body2"
                        sx={{ mt: 2, textAlign: "center", color: "#666" }}
                      >
                        {partData.photo ? "Photo uploaded" : "No photo uploaded"}
                      </Typography>
                    </CardContent>
                  </StyledCard>
                </motion.div>

                {/* QR Code Section */}
                <motion.div variants={itemVariants}>
                  <StyledCard>
                    <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: "#2c3e50",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Inventory color="primary" />
                        Part QR Code
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          p: 3,
                          background: "white",
                          borderRadius: 2,
                          border: "2px dashed #e0e0e0",
                          flexGrow: 1,
                        }}
                      >
                        <QRCode
                          value={qrData}
                          style={{ height: "auto", width: "100%", maxWidth: "300px" }}
                        />
                      </Box>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Stack>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} lg={6}>
              <Stack spacing={3}>
                {/* Part Header */}
                <motion.div variants={itemVariants}>
                  <GradientCard>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                        {partData.partName}
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                        {partData.category?.name || "N/A"}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={partData.status}
                          color={
                            partData.status === "In Stock"
                              ? "success"
                              : partData.status === "Out of Stock"
                              ? "error"
                              : "warning"
                          }
                          variant="outlined"
                          sx={{ color: "white", borderColor: "white" }}
                        />
                        <Chip
                          icon={<Security />}
                          label="Under Warranty"
                          color="success"
                          variant="outlined"
                          sx={{ color: "white", borderColor: "white" }}
                        />
                      </Stack>
                    </CardContent>
                  </GradientCard>
                </motion.div>

                {/* Basic Information */}
                <motion.div variants={itemVariants}>
                  <StyledCard>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, color: "#2c3e50", mb: 3 }}
                      >
                        Part Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <InfoField elevation={0}>
                            <Typography variant="caption" color="textSecondary">
                              Part ID
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                              {partData._id}
                            </Typography>
                          </InfoField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <InfoField elevation={0}>
                            <Typography variant="caption" color="textSecondary">
                              Category
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 500 }}>
                              {partData.category?.name || "N/A"}
                            </Typography>
                          </InfoField>
                        </Grid>
                        <Grid item xs={12}>
                          <InfoField elevation={0}>
                            <Typography variant="caption" color="textSecondary">
                              Description
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ mt: 1, lineHeight: 1.6 }}
                            >
                              {partData.description || "No description available"}
                            </Typography>
                          </InfoField>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </motion.div>

                {/* Status and Stock */}
                <motion.div variants={itemVariants}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <StatusCard>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                              {partData.status}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.7 }}>
                              Current Status
                            </Typography>
                          </Box>
                          <Chip
                            label={
                              partData.status === "In Stock"
                                ? "Available"
                                : "Needs Restock"
                            }
                            sx={{
                              background: "rgba(255,255,255,0.2)",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        </Stack>
                      </StatusCard>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <StyledCard sx={{ height: "100%" }}>
                        <CardContent sx={{ textAlign: "center", p: 2 }}>
                          <Typography variant="caption" color="textSecondary">
                            Last Restock
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{ fontWeight: 600, color: "#11998e" }}
                          >
                            N/A
                          </Typography>
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  </Grid>
                </motion.div>

                {/* Location Info */}
                <motion.div variants={itemVariants}>
                  <StyledCard>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: "#2c3e50",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 3,
                        }}
                      >
                        <LocationOn color="primary" />
                        Location Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                          >
                            <Avatar sx={{ bgcolor: "#e3f2fd" }}>
                              <LocationOn color="primary" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                Building
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {partData.building?.buildingName || "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                          >
                            <Avatar sx={{ bgcolor: "#e8f5e8" }}>
                              <Schedule color="success" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" color="textSecondary">
                                Created At
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {new Date(partData.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </motion.div>

                {/* Part Specs */}
                <motion.div variants={itemVariants}>
                  <StyledCard>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600, color: "#2c3e50", mb: 3 }}
                      >
                        Part Specifications
                      </Typography>
                      <Box>
                        <SpecItem>
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                          >
                            <Build color="primary" />
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              Category
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {partData.category?.name || "N/A"}
                          </Typography>
                        </SpecItem>
                        <SpecItem>
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                          >
                            <LocationOn color="success" />
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              Building
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {partData.building?.buildingName || "N/A"}
                          </Typography>
                        </SpecItem>
                        <SpecItem>
                          <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                          >
                            <Description color="info" />
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              Description
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {partData.description || "N/A"}
                          </Typography>
                        </SpecItem>
                      </Box>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Box>
  );
}