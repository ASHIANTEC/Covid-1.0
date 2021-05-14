var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));

app.engine('html', require('ejs').renderFile);

// Set view engine as EJS

// app.set('view engine', 'ejs');

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database:"covid"
  });
  conn.connect((err,connection) =>{
    if(err)
        console.error('something went wrong..!');
    if(connection)
       
        console.log('connected')
    return;
})

app.get('/',(req,res)=>{
    res.render('login.ejs');
});


var userData ='';
app.post('/login',(req,res) =>{
    var message ='';
    var username =req.body.username; 
    var password = req.body.password;
    var sql = `SELECT COUNT(*) as login FROM covid.login WHERE (username,password) = ('${username}','${password}')`;
    conn.query(sql,(err,result)=>{

        if(result[0].login > 0){
            message="";
            message="Login Successfully!"
            res.render('form.ejs',{message:message,userData:userData});

        }
        else{ 
            console.log('error')
            res.render('login.ejs');
        }
    });
});


app.post('/verify',(req,res) =>{
    var message ='';
    var patient_aadhaar = req.body.patient_aadhaar;
    
    var sql = `SELECT COUNT(*) as aadhaar FROM covid.patient WHERE patient_aadhaar = "${patient_aadhaar}"`;
    
    conn.query(sql,(err,result)=>{

        console.log("Total Records:- " + result[0].aadhaar);

        if(result[0].aadhaar > 0 ) 
        {
            var message ='';
            console.log("Aadhaar already exists");
            message = "Aadhaar already exists ";

                res.render('form.ejs',{message:message,userData:userData});
           
        }
        else{
            var message ='';
            console.log('Go Ahead');
            message = "Go Ahead";
            res.render('form.ejs',{message:message,userData:userData});
        }
    });
    
});

//submit
app.post('/final_verify',(req,res)=>{
    
    var x = Math.floor(Math.random()*1E16)
    //date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    
    today = dd + '/' + mm + '/' + yyyy;
    // console.log(today);

   // patient
  
    var patient_name = req.body.patient_name;
    var patient_id = x;
    var patient_age = req.body.patient_age;
    var patient_aadhaar = req.body.patient_aadhaar;
    var patient_gender = req.body.patient_gender;
    var patient_address = req.body.patient_address;
    var patient_phno = req.body.patient_phno;
   
    // attendar
    var attendar_name = req.body.attendar_name;
    var attendar_aadhaar = req.body.attendar_aadhaar;
    var ref_doctor = req.body.ref_doctor;
    var attendar_phno = req.body.attendar_phno;

    // medicine
    var ct_scan_id = req.body.ct_scan_id;
    var ct_scan_centre = req.body.ct_scan_centre;
    var pcr_icmr = req.body.pcr_icmr;
    var receipt_no = req.body.receipt_no;
 
    var sql = `SELECT COUNT(*) as aadhaar FROM covid.patient WHERE patient_aadhaar = "${patient_aadhaar}"`;

    // console.log("aadhaar:"+patient_aadhaar);
    
    conn.query(sql,(err,result)=>{
     
        if(result[0].aadhaar > 0 ) 
        {
            console.log("Aadhaar already exists");
            var message ='';
            message = "Aadhaar already exists ";
                           
                res.render('form.ejs',{message:message,userData:userData});
            
        }

        else
        
        {

            var sql = "INSERT INTO `covid`.`patient`(`patient_id`,`patient_name`,`patient_age`,`patient_aadhaar`,`patient_gender`,`patient_address`,`patient_phno`,`date`) VALUES ('" + patient_id + "','" + patient_name + "','" + patient_age + "','" + patient_aadhaar + "','" + patient_gender + "','" + patient_address + "','" + patient_phno + "','"+today+"')";
                conn.query(sql,(err, data) => {
                    
                    var sql = "INSERT INTO `covid`.`attendar`(`patient_id`,`attendar_name`,`attendar_aadhaar`,`ref_doctor`,`attendar_phno`,`date`) VALUES('"+patient_id+"','"+attendar_name+"','"+attendar_aadhaar+"','"+ref_doctor+"','"+attendar_phno+"','"+today+"')";
                        conn.query(sql,(err,data)=>{                
                            
                            var sql = "INSERT INTO `covid`.`medicine`(`patient_id`,`ct_scan_id`,`ct_scan_centre`,`pcr_icmr`,`receipt_no`,`date`) VALUES('"+patient_id+"','"+ct_scan_id+"','"+ct_scan_centre+"','"+pcr_icmr+"','"+receipt_no+"','"+today+"')";
                                conn.query(sql,(err,data)=>{   
                                    var message ='';
                                    message = "Successfully Submitted!";
                                    // res.render(__dirname +'form.html',{ message, userData: data });
                                    res.render('form.ejs',{message:message,userData:userData});
                                    
                                });
                      
                        });
                  
                });
            
        }
            
    });

});

app.post('/report',(req,res)=>{
    
    var x = Math.floor(Math.random()*1E16)
    //date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    today = dd+ '/' + mm + '/' + yyyy;
    // console.log(today);

   // patient
  
    var patient_name = req.body.patient_name;
    var patient_id = x;
    var patient_age = req.body.patient_age;
    var patient_aadhaar = req.body.patient_aadhaar;
    var patient_gender = req.body.patient_gender;
    var patient_address = req.body.patient_address;
    var patient_phno = req.body.patient_phno;

    // attendar
    var attendar_name = req.body.attendar_name;
    var attendar_aadhaar = req.body.attendar_aadhaar;
    var ref_doctor = req.body.ref_doctor;
    var attendar_phno = req.body.attendar_phno;

    // medicine
    var ct_scan_id = req.body.ct_scan_id;
    var ct_scan_centre = req.body.ct_scan_centre;
    var pcr_icmr = req.body.pcr_icmr;
    var receipt_no = req.body.receipt_no;

    var sql = `SELECT COUNT(*) as aadhaar FROM covid.patient WHERE patient_aadhaar = "${patient_aadhaar}"`;
    
    conn.query(sql,(err,result)=>{
    
        if(result[0].aadhaar > 0)
        {
            var message ='';
            console.log("Aadhaar already exists");
            message = "Aadhaar already exists ";
            
                res.render('form.ejs',{message:message,userData:userData});
           
        }
        else
        {

            var sql = "INSERT INTO `covid`.`patient`(`patient_id`,`patient_name`,`patient_age`,`patient_aadhaar`,`patient_gender`,`patient_address`,`patient_phno`,`date`) VALUES ('" + patient_id + "','" + patient_name + "','" + patient_age + "','" + patient_aadhaar + "','" + patient_gender + "','" + patient_address + "','" + patient_phno + "','"+today+"')";
                conn.query(sql,(err, data) => {
                    
                    var sql = "INSERT INTO `covid`.`attendar`(`patient_id`,`attendar_name`,`attendar_aadhaar`,`ref_doctor`,`attendar_phno`,`date`) VALUES('"+patient_id+"','"+attendar_name+"','"+attendar_aadhaar+"','"+ref_doctor+"','"+attendar_phno+"','"+today+"')";
                        conn.query(sql,(err,data)=>{                
                            
                            var sql = "INSERT INTO `covid`.`medicine`(`patient_id`,`ct_scan_id`,`ct_scan_centre`,`pcr_icmr`,`receipt_no`,`date`) VALUES('"+patient_id+"','"+ct_scan_id+"','"+ct_scan_centre+"','"+pcr_icmr+"','"+receipt_no+"','"+today+"')";
                                conn.query(sql,(err,data)=>{   

                                    var sql = "SELECT  patient.patient_name,patient.patient_age,patient.patient_aadhaar,patient.patient_gender,patient.patient_address,patient.patient_phno,attendar.attendar_name,attendar.attendar_aadhaar,attendar.attendar_aadhaar,attendar.attendar_phno,attendar.ref_doctor,medicine.ct_scan_id,medicine.ct_scan_centre,medicine.pcr_icmr,medicine.receipt_no from patient patient join attendar attendar on patient.patient_id = attendar.patient_id join medicine medicine on patient.patient_id = medicine.patient_id where patient.patient_aadhaar = '" + patient_aadhaar + "'";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
                                    conn.query(sql, function (err, data) {
                                        var userData='';
                                        var message ='';
                                      
                                        res.render('report.ejs',{ userData: data,message:message});
                                    });
                                });
                      
                        });
                  
                });
        }
            
    });

});
app.post('/report1',(req,res)=>{

    var patient_aadhaar = req.body.patient_aadhaar;
  
    var sql = `SELECT COUNT(*) as aadhaar FROM covid.patient WHERE patient_aadhaar = "${patient_aadhaar}"`;

    conn.query(sql,(err,result)=>{

    if(result[0].aadhaar > 0){
            var sql = "SELECT  patient.patient_name,patient.patient_age,patient.patient_aadhaar,patient.patient_gender,patient.patient_address,patient.patient_phno,attendar.attendar_name,attendar.attendar_aadhaar,attendar.attendar_aadhaar,attendar.attendar_phno,attendar.ref_doctor,medicine.ct_scan_id,medicine.ct_scan_centre,medicine.pcr_icmr,medicine.receipt_no from patient patient join attendar attendar on patient.patient_id = attendar.patient_id join medicine medicine on patient.patient_id = medicine.patient_id where patient.patient_aadhaar = '" + patient_aadhaar + "'";
            var  userData ='';         
            var message='';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
            conn.query(sql, function (err, data) {
            res.render('form.ejs',{ userData: data ,message:message});
      
        });

    }
    else{
        var  userData ='';         
        var message=''; 
        message="Aadhar Does not Exists !"
        
        res.render('form.ejs',{userData:userData,message:message});
       
    }
});

});
var server = app.listen(8080, function () {
   
   console.log("Example app listening at http://localhost:8080")
});