import nodemailer from 'nodemailer'

export default  async (email, subject, text) => {

    const htmlContent = `
    <p>${text}</p>
  <div dir="ltr">
        <table cellpadding="0" cellspacing="0" border="0"
            style="border-spacing:0px;border-collapse:collapse;color:rgb(68,68,68);width:400px;font-size:8pt;font-family:Verdana,sans-serif;background:transparent!important">
            <tbody>
                <tr>
                    <td valign="top" style="padding:5px 0px 0px;width:100px;vertical-align:top"><img alt="photograph"
                            width="90" border="0"
                            src="https://github.com/RizwanSabir/T-FYP/blob/main/public/Logo/LogoWhite.jpg?raw=true"
                            style="border:0px;vertical-align:middle;height:auto;width:90px"></td>
                    <td style="padding:0px;width:20px"></td>
                    <td style="padding:0px;width:280px"><span
                            style="font-size:11pt;color:rgb(248,116,0);font-weight:bold">Rizwan Sabir<br></span><span
                            style="font-size:8pt;line-height:14px;color:rgb(0,0,0);font-style:italic">Sales &amp;
                            Marketing Director<br></span>
                        <p style="margin:0px;padding-top:10px;padding-bottom:0px;font-size:8pt;line-height:14px"><span
                                style="font-size:8pt;line-height:14px;color:rgb(0,0,0)">T: +92 322 740
                                1984<br></span><span style="font-size:8pt;line-height:14px;color:rgb(0,0,0)">E:&nbsp;<a
                                    href="mailto:influencerharbor@gmail.com"
                                    style="background-color:transparent;color:rgb(0,0,0);font-size:8pt"
                                    target="_blank"><span
                                        style="font-size:8pt;line-height:14px">influencerharbor@gmail.com</span></a><br></span><span
                                style="line-height:14px"><span
                                    style="font-size:8pt;line-height:14px;color:rgb(0,0,0)">Sadar Lahore<span
                                        style="font-size:8pt;line-height:14px">,&nbsp;</span></span><span
                                    style="font-size:8pt;line-height:14px;color:rgb(0,0,0)">Pakistan</span></span></p>
                        <p style="margin:10px 0px 0px;padding:0px;text-align:right"><a
                                href="http://www.influencerharbor.com/" rel="noopener"
                                style="background-color:transparent;font-size:8pt;font-weight:bold;color:rgb(248,116,0)!important"
                                target="_blank">www.influencerHarbor.com</a></p>
                    </td>
                </tr>
                <tr>
                    <td valign="top" style="padding:10px 0px 0px;width:100px;vertical-align:top"><a
                            href="https://www.influencerharbor.com/"
                            style="background-color:transparent;color:rgb(51,122,183)" target="_blank"><img border="0"
                                alt="Logo" width="99"
                                src="https://github.com/RizwanSabir/T-FYP/blob/main/public/Logo/LogoTextWhite.jpg?raw=true"
                                style="border:0px;vertical-align:middle;width:99px;height:auto"></a></td>
                    <td style="padding:0px;width:25px"></td>
                    <td style="padding:10px 1px 0px 0px;width:275px;text-align:right"><span>&nbsp;<a
                                href="https://www.facebook.com/MyCompany" rel="noopener"
                                style="background-color:transparent;color:rgb(51,122,183)" target="_blank"><img
                                    border="0" width="13" alt="facebook icon"
                                    src="https://www.mail-signatures.com/signature-generator/img/templates/sweet-but-professional/fb.png"
                                    style="border:0px;vertical-align:middle;height:13px;width:13px"></a></span>&nbsp;<span>&nbsp;<a
                                href="https://www.linkedin.com/company/mycompany404" rel="noopener"
                                style="background-color:transparent;color:rgb(51,122,183)" target="_blank"><img
                                    border="0" width="13" alt="linkedin icon"
                                    src="https://www.mail-signatures.com/signature-generator/img/templates/sweet-but-professional/ln.png"
                                    style="border:0px;vertical-align:middle;height:13px;width:13px"></a></span>&nbsp;<span>&nbsp;<a
                                href="https://www.instagram.com/mycompany404/" rel="noopener"
                                style="background-color:transparent;color:rgb(51,122,183)" target="_blank"><img
                                    border="0" width="13" alt="instagram icon"
                                    src="https://www.mail-signatures.com/signature-generator/img/templates/sweet-but-professional/it.png"
                                    style="border:0px;vertical-align:middle;height:13px;width:13px"></a></span></td>
                </tr>
            </tbody>
        </table>
        <table cellpadding="0" cellspacing="0" border="0"
            style="border-spacing:0px;border-collapse:collapse;color:rgb(68,68,68);width:400px;font-size:8pt;font-family:Verdana,sans-serif;background:transparent!important">
            <tbody></tbody>
        </table>
    </div>
`;



    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
  auth: {
    user: 'influencerharbor@gmail.com',  // your email
    pass: 'kspe qqmp rnsf gnke'          // your app password (ensure it's secure)
  }
,
        });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
            html: htmlContent  
        });
        console.log("Email sent Successfully");
    } catch (error) {
        console.log("Email is not Sent");
        console.log(error);
    }
};
  