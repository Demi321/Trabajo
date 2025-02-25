/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/* global parserJsonData, moment */

var init_estadisticaglobal = (json) => {

    console.log(json);
    let id = json.id;
    let id_usuario = json.id_usuario;
    let tipo_usuario = json.tipo_usuario;
    let tipo_servicio = json.tipo_servicio;
    let tipo_area = json.tipo_area;    
    var h =0;
    var m =0;
    var p =0;
    var puntual=0;
    var r =0;
    var retardo=0;
    var can_hom=0;
    var por_hom=0;
    var can_muj=0;
    var por_muj=0;
    var r_e1=0;
    var r_e2=0;
    var r_e3=0;
    var r_e4=0;
    var r_e5=0;
    var r_e6=0;
    
    var jsonData = $.ajax({        
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/cantidad_empleados',
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({                        
            "tipo_servicio": tipo_usuario
        }),
        async: false
    }).responseText;
    
    var EmpresaData = $.ajax({        
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/empresa_dashboard',
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({                        
            "tipo_usuario": tipo_usuario
        }),
        async: false
    }).responseText;
    
    var paserJsonData= JSON.parse(jsonData);
    var paserEmpresaData= JSON.parse(EmpresaData);
    console.log(paserJsonData);
    document.getElementById("nombre_corporativo").innerHTML= paserEmpresaData.razon_social;
    document.getElementById("Total_sucursales").innerHTML= paserEmpresaData.numero_sucursales;
    document.getElementById("Total_empleados").innerHTML= paserJsonData.length;
    
    console.log("Dashboard Reportes");
    //window.onload = function () {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChartPay);

    function drawChartPay() {
      var data = google.visualization.arrayToDataTable([
          ['Conexion', 'Porcentaje'],
          ['Conexion Web',     50],
          ['Conexion App',      40],
          ['Sin Conexion',  10]        
      ]);

      var options = {
          //pieSliceText: 'none',
          legend: { 'position': 'labeled', textStyle: {color: '#252528'} }, 
          colors:['blue','#439EAE','green','#49C848','red','#004411'],
          backgroundColor: '#ffffff',       
          tooltip: {
              trigger: 'none',
              showColorCode: true,
              text: 'percentage'
          }
      };      
      var chart = new google.visualization.PieChart(document.getElementById('piechart'));
      chart.draw(data, options);
  }
  google.charts.load('current', { packages: ['corechart', 'bar']});   
  google.charts.setOnLoadCallback(drawBasicEdad);    
  google.charts.load('current', { callback: drawBasicEdad, packages:['corechart', 'bar'] });

  function drawBasicEdad() {
        var datos = paserJsonData;
        for (var i = 0; i < datos.length; i++) {       
            var fecha = datos[i].fecha_nacimiento;
            if(fecha === null) {
                r_e6++;
                document.getElementById("sin_fecha_nac").innerHTML=r_e6;
                console.log("ES null");
                console.log("Sin fecha de nacimiento");        
            }
            var hoy = new Date();
            var cumpleanos = new Date(fecha);
            var edad = hoy.getFullYear() - cumpleanos.getFullYear();
            var m = hoy.getMonth() - cumpleanos.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
                edad--;
            }
            console.log(edad);
            if( edad >= 18 && edad <= 25  ){
                r_e1++;
                document.getElementById("18-25").innerHTML=r_e1;
                console.log("rango 18 a 25 ");
            }else if( edad >= 26 && edad <= 35) {
                r_e2++;
                document.getElementById("26-35").innerHTML=r_e2;
              console.log("rango 26 a 35");   
            }else if( edad >= 36 && edad <= 45) {
                r_e3++;
                document.getElementById("36-45").innerHTML=r_e3;
                console.log("rango 36 a 45");
            }else if( edad >= 46 && edad <= 55) {
                r_e4++;
                document.getElementById("46-55").innerHTML=r_e4;
                console.log("rango 46 a 55 ");
            }else if( edad > 60) {
                r_e5++;
                document.getElementById("mas_60").innerHTML=r_e5;
                console.log("Mayores de 60");
            }
        }
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'rango');
      data.addColumn('number', 'Cantidad ');
      data.addColumn({ role: 'style' });
      data.addRows([
        ["De 18 a 25 años", /*rango1*/ r_e1, 'color: #358EA5'],
        ["De 26 a 35 años", /*rango2*/ r_e2, 'color: #F2940D'],
        ["De 36 a 45 años", /*rango3*/ r_e3, 'color: #3A8F48'],
        ["De 46 a 55 años", /*rango4*/ r_e4, 'color: #393d39'],
        ["Mayores de 60 años", /*rango5*/ r_e5, 'color: #900C3F '],
        ["Sin fecha de nacimiento", /*rango6*/ r_e6, 'color: #C5A5CF']
    ]);
      var options = {                       
          legend: 'none',
          backgroundColor: '#fffffff',
          width: '400px',
          height: '300px',
          hAxis: {
              title: 'Rango de Edad',
              textStyle: {
                  color: '#252528'
              }
          },
          vAxis: {
              title: 'No. de Empleados',
              //axisTitlesPosition: 'top',
              titleTextStyle:{color: '#ffffff'},            
              textStyle: {color: '#ffffff'},            
              ticks: [ {v: 30}, {v: 50}, {v: 80}, {v: 100} ]
          }
      };

      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div_edades'));

      chart.draw(data, options);
  }
  google.charts.load('current', { packages: ['corechart', 'bar']});   
  google.charts.setOnLoadCallback(drawBasicSexo);    
  google.charts.load('current', { callback: drawBasicSexo, packages:['corechart', 'bar'] });

  function drawBasicSexo() {
        var datos = paserJsonData;
        console.log(datos);
        for(var i = 0; i < datos.length ; i++) {
            if(datos[i].genero === "Hombre" || datos[i].genero === "Masculino"){
                h++;
                document.getElementById("cantidad_hombres").innerHTML=h;
                por_hom = h/100 * datos.length;                
                document.getElementById("porcentaje_hombres").innerHTML=por_hom;
                console.log(h);
            }else if (datos[i].genero === "Mujer") {
                m++;
                document.getElementById("cantidad_mujeres").innerHTML=m;
                por_muj = m/100 * datos.length;
                document.getElementById("porcentaje_mujeres").innerHTML=por_muj;
                console.log(m);
            }                           
        }
        var total = datos.length; 
        var data = new google.visualization.DataTable();
      data.addColumn('string', 'Sexo');
      data.addColumn('number', 'Cantidad ');    
      data.addColumn({ role: 'style' });
      data.addRows([
        ["Mujer", m, 'color: #358EA5'],
        ["Hombre ", h, 'color: orange']
    ]);
      var options = {
          legend: 'none',
          backgroundColor: '#ffffff',
          width: '400px',
          height: '300px',
          hAxis: {            
              textStyle: {
                  title: 'Sexo',
                  color: '#252528'
              }
          },
          vAxis: {
              title: 'No. de Empleados',
              titleTextStyle:{color: '#ffffff'},                        
              textStyle: {color: '#ffffff'},
              ticks: [ {v: 30}, {v: 50}, {v: 80}, {v: 100} ]
          }
      };

      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div_sexo'));

      chart.draw(data, options);
  }
  google.charts.load('current', { packages: ['corechart', 'bar']});   
  google.charts.setOnLoadCallback(drawBasicSucursales);    
  google.charts.load('current', { callback: drawBasicSucursales, packages:['corechart', 'bar'] });

  function drawBasicSucursales() {        
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Sucursales');
      data.addColumn('number', 'Cantidad ');    
      data.addColumn({ role: 'style' });
      data.addRows([
          ["Sucursal 1", 30, 'color: green'],
          ["Sucursal 2 ", 50, 'color: orange'],
          ["Sucursal 3 ", 20, 'color: #358EA5'],
          ["Sucursal 4 ", 30, 'color: yellow'],
          ["Sucursal 5 ", 20, 'color: #900C3F']
      ]);
      var options = {
          legend: 'none',
          backgroundColor: '#fffffff',
          width: '400px',
          height: '300px',
          hAxis: {            
              textStyle: {
                  title: 'Sexo',
                  color: '#252528'
              }
          },
          vAxis: {
              title: 'No. de Empleados',
              titleTextStyle:{color: '#252528'},                        
              textStyle: {color: '#252528'},
              ticks: [ {v: 30}, {v: 50}, {v: 80}, {v: 100} ]
          }
      };

      var chart = new google.visualization.ColumnChart(document.getElementById('chart_div_sucursales'));

      chart.draw(data, options);
  } 

  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChartActLaboral);

  function drawChartActLaboral() {

    var data = google.visualization.arrayToDataTable([
      ['Actividad', 'Porcentaje'],
      ['Proyectos',     50],
      ['Reuniones de trabajo',      20],
      ['Presentaciones',  20],
      ['Sin conexión', 10] 
    ]);

      var options = {
          pieSliceText: 'none',
          legend: { 'position': 'labeled', textStyle: {color: '#252528'} }, 
          colors:['blue','#439EAE','green','#49C848','red','#004411'],
          backgroundColor: '#ffffff',        
          tooltip: {
              trigger: 'none',
              showColorCode: true,
              text: 'percentage'
          }
      }; 

    var chart = new google.visualization.PieChart(document.getElementById('chart_div_act_laborales'));

    chart.draw(data, options);
  }

  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(drawChartProductividadSucursal);
  function drawChartProductividadSucursal() {
      var data = new google.visualization.DataTable();
      data.addColumn('date', 'Fecha');
      data.addColumn('number', 'Sucursal uno');
      data.addColumn('number', 'Sucursal dos');
      data.addColumn('number', 'Sucursal tres');
      data.addColumn('number', 'Sucursal cuatro');    
      //data.addColumn({ role: 'style' });
      data.addRows([
          [new Date(2020, 11, 14), 50/*amarrillo*/, 115/*rojo*/, 25/*azul*/, 70/*verde*/],
          [new Date(2020, 11, 15), 50/*amarrillo*/, 0/*rojo*/, 60/*azul*/, 25/*verde*/],
          [new Date(2020, 11, 16), 100/*amarrillo*/, 52/*rojo*/, 45/*azul*/,  60/*verde*/],
          [new Date(2020, 11, 17), 50/*amarrillo*/, 92/*rojo*/, 72/*azul*/, 110/*verde*/],
          [new Date(2020, 11, 18), 100/*amarrillo*/, 0/*rojo*/, 25/*azul*/, 51/*verde*/],
          [new Date(2020, 11, 21), 100/*amarrillo*/, 15/*rojo*/, 80/*azul*/, 75/*verde*/]
      ]);        

      var options = {
          legend: 'none',
          pointSize: 5,
          series: {
              0: { color: '#f1ca3a'/*amarillo*/ },
              1: { color: '#e2431e'/*rojo*/ },
              2: { color: '#358EA5'/*azul*/ },
              3: { color: '#6f9654'/* verde*/ }                      
          },        
          hAxis: {                        
              titleTextStyle:{color: '#252528'},
              textStyle: {color: '#252528' }
          },
          vAxis: {
              title:'Productividad',
              titleTextStyle:{color: '#252528'},
              labelString: "Percentage",
              textStyle: {color: '#252528'},
              ticks: [ {v: 0, f:"0%"}, {v: 50, f:"50%"}, {v: 70, f:"70%"}, {v: 100, f:"100%"} ]
          },
          backgroundColor: '#ffffff'
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div4'));
      chart.draw(data, options);
  }
  google.charts.load('current', {packages: ['corechart', 'line']});
  google.charts.setOnLoadCallback(drawChartInversionTiempo);
  function drawChartInversionTiempo() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Actividad');
      data.addColumn('number', 'Sucursal uno');
      data.addColumn('number', 'Sucursal dos');
      data.addColumn('number', 'Sucursal tres');
      data.addColumn('number', 'Sucursal cuatro');

      data.addRows([
        ['Proyectos',  50, 100, 200,280],
        ['Videollamdas',  50, 100, 180,320],
        ['Llamadas', 60, 105, 150, 300],
        ['Presentaciones', 100, 205, 299,310],
        ['Descanso', 50, 102, 295, 300],
        ['Sin conexion a la plataforma', 180, 210, 300, 350]    
      ]);        

      var options = {
          legend: 'none',
          pointSize: 5,
          backgroundColor: '#ffffff',        
          series: {
              0: { color: '#49C848'/*azul*/ },
              1: { color: 'yellow'/*amarillo*/ },
              2: { color: '#439EAE'/* verde*/ },
              3: { color: '#ef0c0c'/*rojo*/ }                      
          },        
          hAxis: {
              title:'Actividad',
              titleTextStyle:{color: '#252528'},
              textStyle: {color: '#252528' }
          },
          vAxis: {
              title:'Tiempo',
              titleTextStyle:{color: '#252528'}, 
              textStyle: {color: '#252528'},
              ticks: [ {v: 0, f: '0 hr'}, {v: 100, f: '100 hrs'}, {v: 200, f: '200 hrs'}, {v: 300, f: '300 hrs'} ]        
          }
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div_line'));
      chart.draw(data, options);
    }
    var fecha_hoy = moment().format("YYYY-MM-DD");
    var DatosJornada = $.ajax({           
        type: 'POST',
        url: '/' + DEPENDENCIA + '/API/estatus_jornada_laboral/',
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({                        
            "fecha_hoy": fecha_hoy
        }),
        async: false
    }).responseText;
    
    var parserJornadaData = JSON.parse(DatosJornada);
    for (var i = 0; i < parserJornadaData.length; i++) {
        var hora_entrada = parserJornadaData[i].time_created;      
        if(hora_entrada >= '09:00:00' && hora_entrada <= '09:15:00'){
            console.log("puntual");
            p++;
        }else if(hora_entrada > '09:15:01 '){
            console.log("retardo");
            r++;
        }
    }
    puntual = p/100 * parserJornadaData.length;
    retardo = r/100 * parserJornadaData.length;
    document.getElementById("PorcentajePuntales").innerHTML = puntual + "%";
    document.getElementById("PorcentajeRetardos").innerHTML = retardo + "%";
    puntual = parseInt(puntual);
    retardo = parseInt(retardo).toFixed(2);     
    document.addEventListener("load", setColorBasal(2,'Faltas'));
    document.addEventListener("load", setColorBasal(retardo,'Retardos'));
    document.addEventListener("load", setColorBasal(puntual,'Puntales'));
    function setColorBasal(numero, clase) { 
        numero = parseInt(numero);        
        switch (clase) {
            case  'Faltas':
                for (var i= 1; i <= numero; i++) {
                    document.getElementById("recFalt1_"+i.toString()).className = "rectangleColor1";
                }
                break;
            case  'Retardos':
                for (var i= 1; i <= numero; i++) {
                    document.getElementById("recReta2_"+i.toString()).className = "rectangleColor2";
                }
                break;
            case  'Puntales':
                for (var i= 1; i <= numero; i++) {
                    document.getElementById("recPunt3_"+i.toString()).className = "rectangleColor3";
                }
                break;        
        }
    }    

};

