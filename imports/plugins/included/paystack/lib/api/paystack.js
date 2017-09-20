import request from "request";

export const Paystack = {};

const paystackHeaders = (secret) => {
  return {
    "Authorization": `Bearer ${secret}`,
    "Content-Type": "application/json"
  };
};

Paystack.verify = (reference, secret, cb) => {
  const refId = JSON.parse(reference).reference;
  const headers = paystackHeaders(secret);
  const url = `https://api.paystack.co/transaction/verify/${refId}`;
  request.get(url, { headers }, (err, response, body) =>  {
    const res = JSON.parse(body);
    if (res.status) {
      cb(null, res);
    } else {
      cb(res, null);
    }
  });
};
