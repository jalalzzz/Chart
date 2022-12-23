import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';



@Component({
  selector: 'app-chart1',
  templateUrl: './chart1.component.html',
  styleUrls: ['./chart1.component.css']
})
export class Chart1Component implements OnInit {

  private treeData = {
    "name": "Eve",
    "value": 15,
    "rectDisplay": "black",
    "pathColor": "yellow",
    "icon": "./../../assets/images/database_1.png",
    "children": [
      {
        "name": "Cain",
        "value": 10,
        "rectDisplay": "block",
        "icon": "./../../assets/images/database.png",
        "pathColor": "red"

      },
      {
        "name": "Seth",
        "value": 10,
        "rectDisplay": "block",
        "icon": "./../../assets/images/medical-app.png",
        "pathColor": "red",
        "children": [
          {
            "name": "Enos",
            "value": 7.5,
            "rectDisplay": "block",
            "icon": "./../../assets/images/database.png",
            "pathColor": "purple"
          },
          {
            "name": "Noam",
            "value": 7.5,
            "rectDisplay": "block",
            "icon": "./../../assets/images/database_1.png",
            "pathColor": "red"
          }
        ]
      },
      {
        "name": "Abel",
        "value": 10,
        "rectDisplay": "block",
        "icon": "./../../assets/images/medical-app.png",
        "pathColor": "blue"
      },
      {
        "name": "Awan",
        "value": 10,
        "rectDisplay": "block",
        "pathColor": "green",
        "icon": "./../../assets/images/database.png",
        "children": [
          {
            "name": "Enoch",
            "value": 7.5,
            "rectDisplay": "block",
            "icon": "./../../assets/images/database_1.png",
            "pathColor": "orange"
          }
        ]
      },
      {
        "name": "Azura",
        "value": 10,
        "rectDisplay": "block",
        "icon": "./../../assets/images/pc.png",
        "pathColor": "green"
      }
    ]
  };
  private svg: any;
  private margin: any;
  private width: any;
  private height: any;
  ngOnInit(): void {

    var listColor: String[] = ['red', 'white', 'green', 'blue', 'orange', 'purple'];
    var listValue: Number[] = [5, 10, 15, 20, 25, 30, 35, 40];
    var listName: String[] = ['Azura', 'Enoch', 'Awan', 'Abel', 'Noam', 'Enos', 'Seth', 'Cain', 'Eve'];
    var listIcon: String[] = ["./../../assets/images/pc.png", "./../../assets/images/database_1.png", "./../../assets/images/database.png", "./../../assets/images/medical-app.png",];
    var myinterval: any;


    const createRandomData = (level = 0, showRect = 1) => {

      let name = listName[Math.floor(Math.random() * listName.length)];
      let value = listValue[Math.floor(Math.random() * listValue.length)];
      let rectDisplay = showRect == 1 ? "block" : 'none';
      let icon = listIcon[Math.floor(Math.random() * listIcon.length)];
      let pathColor = listColor[Math.floor(Math.random() * listColor.length)];

      let object: any = {

        "name": name,
        "value": value,
        "rectDisplay": rectDisplay,
        "icon": icon,
        "pathColor": pathColor
      }

      if (level < 5) {
        if (Math.floor(Math.random() * 3) == 1 || level < 2) {

          let numChild = Math.floor(Math.random() * 2) + 1;
          object['children'] = []
          for (var i = 0; i < numChild; i++)
            object['children'].push(createRandomData(level + 1, showRect))
        }

      }
      //  console.log(object);
      return object;




    }
    var randomData = createRandomData(0, Math.floor(Math.random() * 2));
    console.log(randomData);

    var mouseover = function (event: any) {


      myinterval = setTimeout(() => {
        Tooltip
          .style("opacity", 1)
          .style("stroke", "black")
          .style("opacity", 1)
      }, 100)

    }
    var mousemove = function (event: any) {
      //   console.log(event)
      var txt: String = event.path.filter(function (d: any, index: number, array: Array<Element>) {
        if (index < array.length - 4 && d.getAttribute('class') != null) {
          //    console.log(d.getAttribute('class'))
          return (d.getAttribute('class').includes("node--"));
        }

      })[0].children[4].innerHTML;

      Tooltip
        .html(" " + txt)
        .style("left", (event.screenX) + "px")
        .style("top", ((event.screenY - 70) + "px"))
        .style("position", "absolute")
    }
    var mouseleave = function (event: any) {
      console.log(event)
      clearTimeout(myinterval);
      myinterval = setTimeout(() => {
        Tooltip
          .style("opacity", 0)
          .style("stroke", "none")
      }, 2000)
      Tooltip
        .style("opacity", 0)
        .style("stroke", "none")

    }

    // set the dimensions and margins of the diagram
    const margin = { top: 20, right: 90, bottom: 30, left: 90 },
      width = 660 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    // declares a tree layout and assigns the size
    const treemap = d3.tree().size([height, width]);

    //  assigns the data to a hierarchy using parent-child relationships
    let nodes: any = d3.hierarchy(randomData, (d: any) => d.children);

    // maps the node data to the tree layout
    nodes = treemap(nodes);



    // append the svg object to the chart of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin


    const svg = d3.select<SVGSVGElement, unknown>(".chart1")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .call(d3.zoom<SVGSVGElement, unknown>().on("zoom", function (event, d3) {

        svg.attr("transform", event.transform)
      }))

    const g = svg.append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // adds the links between the nodes
    const link = g.selectAll(".link")
      .data(nodes.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .style("stroke", (d: any) => d.data.pathColor)
      .attr("d", (d: any) => {
        return "M" + d.y + "," + d.x
          + "C" + (d.y + d.parent.y) / 2 + "," + d.x
          + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
          + " " + d.parent.y + "," + d.parent.x;
      });

    // adds each node as a group
    const node = g.selectAll(".node")
      .data(nodes.descendants())
      .enter().append("g")
      .attr("class", (d: any) => "node" + (d.children ? " node--internal" : " node--leaf"))
      .attr("transform", (d: any) => "translate(" + d.y + "," + d.x + ")")
      .on("click", function (event) {
        //  console.log(event)
        // console.log(event.target.parentNode.children[4])
        d3.select(event.target.parentNode.children[4])
          .style("display", "block")

      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
    //
    node.append("rect")
      .attr("class", "rect-node")
      .style("display", (d: any) => { return d.data.rectDisplay; })

    node.append("image")
      .attr("xlink:href", (d: any) => { return d.data.icon; })
      .attr("class", "image-node")

    //<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
    node.append("circle")
      .attr("class", "circle-node")


    node.append("text")
      .attr("x", "25px")
      .attr("y", "-14px")
      .attr('class', 'heavy')
      .text((d: any) => d.data.value);




    // adds the text to the node
    node.append("text")
      .attr("dy", ".35em")
      .attr("x", "-20px")
      .attr("y", "40px")
      .attr("fill", "white")

      //  .style("text-anchor", (d: any) => d.children ? "end" : "start")
      .style("display", "none")
      .style("color", "white")
      .text((d: any) => d.data.name);

    var Tooltip = d3.select(".chart1")
      .append("div")
      .attr("class", "tooltip")




  }

}
