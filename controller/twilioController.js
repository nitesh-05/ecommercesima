import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

var PH_NUMBER = process.env.PH_NUMBER;
var TO_PH_NUMBER = process.env.TO_PH_NUMBER;

console.log(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

let phoneNumbers = ["+919905750796", "+919835113943"];
export const createSmsController = async (req, res) => {
  const { title, description } = req.body;
  for (const phoneNumber of phoneNumbers) {
    try {
      const message = await client.messages.create({
        body: description,
        to: phoneNumber,
        from: PH_NUMBER,
      });
      res.status(200).send({
        success: true,
        message: message,
      });
    } catch (error) {
      // You can implement your fallback code here
      res.status(500).send({
        success: false,
        error,
        message: "Error in sending sms",
      });
    }
  }
};

export const validatePhoneController = async (req, res) => {
  try {
    client.validationRequests.create({
      friendlyName: "My Voda",
      phoneNumber: req.body.phoneNo,
    });
    // .then((validation_request) => console.log(validation_request.friendlyName));
    res.status(200).send({
      success: true,
      message: "Phone number verified!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in sending sms",
    });
  }
};

export const getUserListController = async (req, res) => {
  //   try {
  //     const outgoingCallerIds = await client.outgoingCallerIds.list({
  //       limit: 20,
  //     });
  //     const phoneNumbersWithSids = outgoingCallerIds.map((o) => ({
  //       sid: o.sid,
  //       phoneNumber: o.phoneNumber,
  //     }));

  //     res.status(200).send({
  //       success: true,
  //       message: phoneNumbersWithSids,
  //     });
  //   } catch (error) {
  //     res.status(500).send({
  //       success: false,
  //       error,
  //       message: "Error in retrieving user list",
  //     });
  //   }

  try {
    const outgoingCallerIds = await client.outgoingCallerIds.list({
      limit: 20,
    });

    const phoneNumbersWithSids = outgoingCallerIds.map((o) => ({
      sid: o.sid,
      phoneNumber: o.phoneNumber,
    }));

    res.status(200).send({
      success: true,
      message: phoneNumbersWithSids,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in retrieving user list",
    });
  }
};
