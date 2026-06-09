export const zoomIsEnabled = (config: ZoomConfigFields) => {
   const { zoom_account_email, zoom_account_id, zoom_client_id, zoom_client_secret } = config;

   return Boolean(zoom_account_email && zoom_account_id && zoom_client_id && zoom_client_secret);
};

export const zoomSDKIsEnabled = (config: ZoomConfigFields) => {
   const { zoom_web_sdk, zoom_sdk_client_id, zoom_sdk_client_secret } = config;

   return Boolean(zoom_web_sdk && zoom_sdk_client_id && zoom_sdk_client_secret);
};
