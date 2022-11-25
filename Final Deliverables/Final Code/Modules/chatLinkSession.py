def chatLinkSession(username, link):
    html = '''
    <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Fira+Sans+Condensed&amp;display=swap" rel="stylesheet">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">

  <style type="text/css">
</style>      
</head>
<body style="font-family: 'Fira Sans Condensed', sans-serif; color: black;">
    <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:inherit; color:#000000; background-color:#f0f0f0;">
        <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" role="module" data-type="columns" style="padding:30px 0px 30px 20px;" data-distribution="1">
            <tbody>
                <tr role="module-content">
                    <td height="100%" valign="top">
                        <table width="560" style="width:560px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;" cellpadding="0" cellspacing="0" align="left" border="0"class="column column-0">
                        <tbody>
                            <tr>
                                <td style="padding:0px;margin:0px;border-spacing:0;">
                                    <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="a169501c-69eb-4f62-ad93-ac0150abdf03">
                                    <tbody>
                                        <tr>
                                            <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="left">
                                                <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;" width="154" alt="" data-proportionally-constrained="true" data-responsive="false" src="http://cdn.mcauto-images-production.sendgrid.net/8e1f1ee59ee2881a/dd5fdf6b-4486-4e16-afd3-d6e5c24cc91c/236x77.png" height="52">
                                            </td>
                                        </tr>
                                    </tbody>
                                    </table>
                                <td>
                            <tr>
                        </tbody>
                        </table>
                    <td>
                <tr>
            </tbody>
        </table>
        <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="080768f5-7b16-4756-a254-88cfe5138113" data-mc-module-version="2019-10-22">
        <tbody>
            <tr>
                <td style="padding:30px 30px 18px 30px; line-height:36px; text-align:inherit;" height="100%" valign="top"  role="module-content"><div><div style="font-family: inherit; text-align: center"><span style="color: #000; font-size: 48px; font-family: inherit">Greeting's, {}</span></div><div></div></div>
                </td>
            </tr>
        </tbody>
        </table>
        <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="cddc0490-36ba-4b27-8682-87881dfbcc14" data-mc-module-version="2019-10-22">
        <tbody>
            <tr>
                <td style="padding:18px 30px 18px 30px; line-height:22px; text-align:inherit;"  height="100%" valign="top"  role="module-content"><div><div style="font-family: inherit; text-align: inherit"><span style="color: #000; font-size: 15px">Your query is in progress,a Agent has been allocated for your ticket resolution.A secure session has been established for you and assigned agent to start communicating!! </span></div><div></div></div>
                </td>
            </tr>
        </tbody>
        </table>
        <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="cd669415-360a-41a6-b4b4-ca9e149980b3">
      <tbody>
        <tr>
          <td align="center"  class="outer-td" style="padding:10px 0px 40px 0px;" >
            <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
              <tbody>
                <tr>
                <td align="center" bgcolor="#ffc94c" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                    <a href="http://127.0.0.1:5000/{}" style="background-color:#ffc94c; border:1px solid #ffc94c; border-color:#ffc94c; border-radius:40px; border-width:1px; color:#3f4259; display:inline-block; font-size:15px; font-weight:normal; letter-spacing:0px; line-height:25px; padding:12px 18px 10px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit; width:168px;" target="_blank">Start Chat</a>
                </td>
                </tr>
              </tbody>
            </table>
                </td>
                </tr>
              </tbody>
            </table>
            <div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5"><p style="font-size:12px; line-height:20px;"><a class="Unsubscribe--unsubscribeLink" href="" target="_blank">Unsubscribe</a> - <a href="" target="_blank" class="Unsubscribe--unsubscribePreferences" >Unsubscribe Preferences</a></p></div>
    </center>
</body>
</html>
    '''.format(username, link)
    return html
