# Installation Guide

## Prerequisites

The Twitchr Web Application uses the following third parties which you will need credentials for:

1. [Twilio](https://www.twilio.com/go/twilio-brand-sales-1?utm_source=google&utm_medium=cpc&utm_term=twilio&utm_campaign=G_S_EMEA_Brand_UKI_EN_NV&cq_plac=&cq_net=g&cq_pos=&cq_med=&cq_plt=gp&gclid=Cj0KCQiAnNacBhDvARIsABnDa6__gSs4f24jABB6Q3kJX46oTS16s0VkrDZlmqKDnOFMP8TbWmNnEGoaArbJEALw_wcB)
2. [Mailgun SMTP](https://www.mailgun.com/products/send/smtp/)
3. [OpenWeatherMap](https://openweathermap.org/api)
4. [HiveMQ](https://www.hivemq.com/)
5. [Firebase](https://firebase.google.com/?gclid=Cj0KCQiAnNacBhDvARIsABnDa68-eTvFsxp5RIAn5KYARCxjWiYVLHCjL41C-AB4h17VS5RBJfkvdZ8aAvcVEALw_wcB&gclsrc=aw.ds)

Although not required, [Thingspeak’s](https://thingspeak.com/) Time Control can be utilized to get weather updates each hour.

## How to Launch the Application Locally

1. Clone into the repo or download the twitchr-app folder and cd into it.
2. Ensure you have `node` and `npm` installed locally
3. Create and populate the `env` file with the required credentials used by the application (e.g. `TWILIO_AUTH_TOKEN`)
4. Run the following commands in the shell:
    
    ```bash
    npm install
    npm start
    ```
    
5. Visit the site at the port specified in the shell output
