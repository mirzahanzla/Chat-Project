import { Router } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import user from '../../models/user.js';

const router = Router();


// Check if brand name exists
router.post('/check-brandName', async (req, res) => {
  const { brandName } = req.body;
  console.log("Request body:", req.body);

  try {
    // Query for a user with the specified brand name and userType
    const brand = await user.findOne({ fullName: brandName, userType: "Brand" });

    return res.status(200).json({ exists: !!brand });
  } catch (error) {
    console.error('Error checking brand name:', error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
});

// Check if brand username exists
router.post('/check-brandUsername', async (req, res) => {
  const { brandUserName } = req.body;
  console.log("Request body:", req.body);

  try {
    // Query for a user with the specified username and userType
    const brand = await user.findOne({ userName: brandUserName, userType: "Brand" });
    console.log("Brand Username is:", brand);

    return res.status(200).json({ exists: !!brand });
  } catch (error) {
    console.error('Error checking brand username:', error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
});


router.post('/check-InfluencerUserName', async (req, res) => {
  const { userName } = req.body;
 

  try {
    // Check if the brand name exists in the database
    const userData = await user.findOne({ userName:userName,userType: "influencer" });

    if (userData) {
      // Brand name exists
      return res.status(200).json({ exists: true });
    } else {
      // Brand name does not exist
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking brand name:', error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
});


router.post('/check-UserName', async (req, res) => {
  const { userName } = req.body;
 

  try {
    // Check if the brand name exists in the database
    const userData = await user.findOne({ userName:userName,userType: "User" });

    if (userData) {
      // Brand name exists
      return res.status(200).json({ exists: true });
    } else {
      // Brand name does not exist
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking brand name:', error);
    return res.status(500).json({ error: 'Server error occurred' });
  }
});


export default router;
