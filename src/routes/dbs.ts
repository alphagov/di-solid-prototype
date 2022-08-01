import express from "express";
import {
  dbsContentPageGet,
  proveYourIdentityGet,
  proveYourIdentityPost,
  applyGet,
  otherNamesGet,
  whatIsYourSexGet,
  whatIsYourSexPost,
  whereWereYouBornGet,
  whereWereYouBornPost,
  ninoGet,
  ninoPost,
  drivingLicenceGet,
  drivingLicencePost,
  certificateAddressWhereGet,
  certificateAddressWherePost,
  emailAddressGet,
  emailAddressPost,
  mobileNumberGet,
  mobileNumberPost,
  whoIsPayingGet,
  whoIsPayingPost,
  checkYourDetailsGet,
  checkYourDetailsPost,
  reviewYourApplicationGet,
  reviewYourApplicationPost,
  disclaimerGet,
  disclaimerPost,
} from "../controllers/dbs";

const router = express.Router();

router.get("/request-a-basic-dbs-check", dbsContentPageGet);
router.get("/prove-your-identity", proveYourIdentityGet);
router.post("/prove-your-identity", proveYourIdentityPost);
router.get("/apply-for-a-basic-dbs-check", applyGet);
router.get("/other-names", otherNamesGet);
router.get("/what-is-your-sex", whatIsYourSexGet);
router.post("/what-is-your-sex", whatIsYourSexPost);
router.get("/where-were-you-born", whereWereYouBornGet);
router.post("/where-were-you-born", whereWereYouBornPost);
router.get("/nino", ninoGet);
router.post("/nino", ninoPost);
router.get("/driving-licence", drivingLicenceGet);
router.post("/driving-licence", drivingLicencePost);
router.get("/certificate-address-where", certificateAddressWhereGet);
router.post("/certificate-address-where", certificateAddressWherePost);
router.get("/email-address", emailAddressGet);
router.post("/email-address", emailAddressPost);
router.get("/mobile-number", mobileNumberGet);
router.post("/mobile-number", mobileNumberPost);
router.get("/who-paying", whoIsPayingGet);
router.post("/who-paying", whoIsPayingPost);
router.get("/check-your-details", checkYourDetailsGet);
router.post("/check-your-details", checkYourDetailsPost);
router.get("/review-your-application", reviewYourApplicationGet);
router.post("/review-your-application", reviewYourApplicationPost);
router.get("/disclaimer", disclaimerGet);
router.post("/disclaimer", disclaimerPost);

export default router;
