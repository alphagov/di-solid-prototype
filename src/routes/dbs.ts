import express from "express";
import {
  dbsContentPageGet,
  proveYourIdentityGet,
  applyGet,
  otherNamesGet,
  whatIsYourSexGet,
  whereWereYouBornGet,
  ninoGet,
  drivingLicenceGet,
  certificateAddressWhereGet,
  emailAddressGet,
  mobileNumberGet,
  whoIsPayingGet,
  checkYourDetailsGet,
  reviewYourApplicationGet,
  disclaimerGet
} from "../controllers/dbs"

const router = express.Router();

router.get('/request-a-basic-dbs-check', dbsContentPageGet);
router.get('/prove-your-identity', proveYourIdentityGet);
router.get('/apply-for-a-basic-dbs-check', applyGet);
router.get('/other-names', otherNamesGet);
router.get('/what-is-your-sex', whatIsYourSexGet);
router.get('/where-were-you-born', whereWereYouBornGet);
router.get('/nino', ninoGet);
router.get('/driving-licence', drivingLicenceGet);
router.get('/certificate-address-where', certificateAddressWhereGet);
router.get('/email-address', emailAddressGet);
router.get('/mobile-number', mobileNumberGet);
router.get('/who-paying', whoIsPayingGet);
router.get('/check-your-details', checkYourDetailsGet);
router.get('/review-your-application', reviewYourApplicationGet);
router.get('/disclaimer', disclaimerGet);

export {router as dbsRouter};
