import { View, Text, SafeAreaView, useWindowDimensions, ScrollView } from 'react-native'
import React from 'react'
import Header from '../../component/Header'
import RenderHtml from 'react-native-render-html';
import { heightPercentageToDP } from 'react-native-responsive-screen';



const Privacy = () => {
  const source = {
    html: `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - WhatsStatus</title>
</head>
<body>
    <h1>Privacy Policy for WhatsStatus</h1>

    <p>Effective Date: July 26, 2024</p>

    <h2>1. Introduction</h2>
    <p>Welcome to WhatsStatus. We are committed to protecting your privacy and ensuring you have a positive experience on our app. This policy outlines our practices concerning the app's use and the permissions it requires.</p>

    <h2>2. Information We Don't Collect</h2>
    <p>WhatsStatus does not collect, store, or transmit any personal data from its users. We do not have user accounts, login systems, or any means of user identification.</p>

    <h2>3. Permissions</h2>
    <p>WhatsStatus requires the following permissions to function:</p>
    <ul>
        <li><strong>Internet Access:</strong> This is required to display advertisements within the app.</li>
        <li><strong>Read External Storage:</strong> This permission is necessary to access and read WhatsApp status files on your device.</li>
        <li><strong>Write External Storage:</strong> This permission is required to save WhatsApp status files to your device.</li>
    </ul>

    <h2>4. Advertisements</h2>
    <p>WhatsStatus displays third-party advertisements. These ad providers may use technologies to collect data to provide personalized advertising. However, we do not share any user data with these providers as we do not collect any. For more information about how ad providers handle data, please refer to their respective privacy policies.</p>

    <h2>5. Children's Privacy</h2>
    <p>WhatsStatus does not knowingly collect or solicit any information from anyone under the age of 12. The app is not directed at children under 13. In the event that we learn we have collected personal information from a child under 13 without parental consent, we will delete that information as quickly as possible.</p>

    <h2>6. Changes to This Policy</h2>
    <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page. You are advised to review this privacy policy periodically for any changes.</p>

    <h2>7. Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, please contact us at:</p>
    <p>Email: rajrock7254@gmail.com</p>

    <p>By using WhatsStatus, you agree to the collection and use of information in accordance with this policy.</p>
</body>
</html>
      
      `
  };
  const { width } = useWindowDimensions();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <ScrollView style={{ paddingHorizontal: heightPercentageToDP(0.5) }}>
        <RenderHtml contentWidth={width} source={source} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Privacy