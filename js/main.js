var nodes = null;
var links = null;
var tempArray = [];
var arrLine = [];
var arrFilter = [];
var flag = false;
var width = 800, height = 550;
var svg;
var rect;
var svgDiv;
var line;
var node;
var lineSlider = {
    xS: 0,
    yS: 0,
    xE: 0,
    yE: height,
    name: ''
};

var arrayRect = [];
var arrayText = [];
var arrayPoint = [];

var arrayLeters = ['A:', 'B:', 'C:', 'D:', 'E:', 'F:', 'G:', 'H:', 'I:', 'J:', 'K:', 'L:', 'M:', 'N:', 'O:', 'P:', 'Q:', 'R:', 'S:', 'T:', 'U:', 'V:', 'W:', 'X:', 'Y:', 'Z:', 'AA:', 'AB:', 'AC:', 'AD:', 'AE:', 'AF:', 'AG:', 'AH:', 'AI:', 'AJ:', 'AK:', 'AL:', 'AM:', 'AN:', 'AO:', 'AP:', 'AQ:', 'AR:', 'AS:', 'AT:', 'AU:', 'AV:', 'AX:', 'AY:', 'AZ:', 'BA:', 'BB:', 'BC:', 'BD:', 'BE:', 'BF:', 'BG:', 'BH:', 'BI:', 'BJ:', 'BK:', 'BL:', 'BM:', 'BN:', 'BO:', 'BP:', 'BQ:', 'BR:', 'BS:', 'BT:', 'BU:', 'BV:', 'BW:', 'BX:', 'BY:', 'BZ:'];

var nameLastSelect;

function OnHundred() {
    createTree(100, "data/tree.json")
}

function OnOneThousand() {
    createTree(1280, "data/tree1.json")
}

function OnFiveThousand() {
    createTree(5120, "data/tree2.json")
}

function OnTenThousand() {
    createTree(10240, "data/tree3.json")
}

function createTree(coutLeaf, nameJsonfile) {
    arrayRect = [];
    arrayText = [];
    arrayPoint = [];
    arrFilter = [];
    arrLine = [];
    lineSlider = {
        xS: 0,
        yS: 0,
        xE: 0,
        yE: height,
        name: ''
    }
    var svg = d3.select("svg");
    svg.selectAll("*").remove();
    d3.select("svg").remove();
    document.getElementById('#name').textContent = coutLeaf;
    addSvgObjtoDOM();
    loadJson(nameJsonfile);
}

function loadJsonD3(name) {
    let promise = new Promise(function (resolve, reject) {
        d3.json(name, function (error, root) {
            if (error)
                reject();
            else
                resolve(root);
        });
    });

    return promise;
}
         
function loadJson(name) {
    loadJsonD3(name).then((resolve) => {
        renderTree(resolve);
    })
    .catch(reject => console.error(reject));
}
 
function renderTree(root) {
    nodes = null;
    links = null;
    node = null;
    arrFilter = null;

    nodes = tree.nodes(root);
    links = tree.links(nodes);

    nodes.forEach(function (n) {
        if (n.offset !== undefined) {
            if (n.offset === 0 && n.y !== 720) {
                n.y += 720 - n.y;
            }
            else {
                n.y += n.offset;
            }
        }
    });

    svg.selectAll(".link")
       .data(links)
       .enter().append("path")
       .attr("class", "link")
       .attr("d", elbow);

    node = svg.selectAll(".node")
                  .data(nodes)
                  .enter().append("g")
                  .attr("class", "node")
                  .attr("transform", function (d) {
                      return "translate(" + d.y + "," + d.x + ")";
                  });

    creatArrayLine(links);

    arrFilter = arrLine.filter(function (value) {
        return value.offset !== 0;
    });

    var text = node.append("circle")
                  .attr("r", 5)
                  .style("visibility", "hidden")
                  .attr("class", function (d) { return d.name })
                  .on("mouseover", function () {
                      d3.select(this).style("cursor", "pointer");
                      nameLastSelect = this.className.animVal + 'a1';
                      d3.select('.' + nameLastSelect).attr('filter', "url(#solid)").attr('fill', "white");
                  })
                  .on("mouseleave", function () {
                      d3.select('.' + nameLastSelect).attr('filter', 'none').attr('fill', "black");
                  });

    showPoint(node, lineSlider);
}

function findNodeChild(obj) {
    for (var i = 0; i < obj.length; i++) {
        if (Array.isArray(obj)) {
            if (Array.isArray(obj[i].children))
                findNodeChild(obj[i].children);
            else {
                var point = {
                    x: 0,
                    y: 0,
                    name: ''
                }

                point.x = obj[i].x;
                point.y = obj[i].y;
                point.name = obj[i].name;

                tempArray.push(point);
            }
        }

    }
}

function getSelectRect(tempArray) {
    var xMin = 0;
    var xMax = 0;

    tempArray.forEach(function (a) {
        if (xMin === 0 && xMax === 0) {
            xMin = a.x;
            xMax = a.x;
        }

        if (xMin > a.x) {
            xMin = a.x;
        }

        if (xMax < a.x) {
            xMax = a.x;
        }
    });

    return {
        x: 0,
        y: xMin,
        width: 800,
        height: (xMax - xMin)
    }
}

function creatArrayLine(links) {
    links.forEach(function (l) {
        var coordinatLine = {
            xS: 0,
            yS: 0,
            xE: 0,
            yE: 0,
            name: '',
            offset: 0,
            rect: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        };

        tempArray = [];

        if (Array.isArray(l.target.children))
            findNodeChild(l.target.children);

        coordinatLine.xS = Math.round(l.source.y);
        coordinatLine.yS = Math.round(l.target.x);
        coordinatLine.xE = Math.round(l.target.y);
        coordinatLine.yE = Math.round(l.target.x);
        coordinatLine.offset = l.target.offset;
        coordinatLine.name = l.target.name;

        coordinatLine.rect = getSelectRect(tempArray);

        arrLine.push(coordinatLine);
    });

}

function elbow(d) {
    return `M${d.source.y}, ${d.source.x}V${d.target.x}H${d.target.y}`;
}

function addSvgObjtoDOM() {

    svg = d3.select(".svgDiv")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(40,40)")

    var filter = d3.select("svg")
                   .append("filter")
                   .attr('x', 0)
                   .attr('y', 0)
                   .attr("width", 1)
                   .attr("height", 1)
                   .attr('id', 'solid')

    filter.append("feFlood")
           .attr('flood-color', '#0094ff')

    filter.append("feComposite")
        .attr('in', 'SourceGraphic');

    svg.append("line")
            .style("stroke", "black")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 720)
            .attr("y2", 0)
            .style("user-select", "none");

    line = svg.append("line")
              .style("stroke", "black")
              .attr("x1", 0)
              .attr("y1", 0)
              .attr("x2", 0)
              .attr("y2", height)
              .attr("id", "lineID");

    rect = svg.append("rect")
              .attr("x", -5)
              .attr("y", -10)
              .attr("width", 10)
              .attr("height", 20)
              .attr("class", 'slider')
              .style("cursor", "pointer")
              .on("mousedown", function () {
                  flag = true;
              });

    svgDiv = d3.select("body")
               .on("mousemove", function () {
                   if (flag) {
                       var x = d3.mouse(this)[0];
                       if (x > 40 && x < 765) {
                           d3.select(".slider").attr("transform", function () {
                               return "translate(" + (x - 40) + ",0)"
                           });
                           var a = line.attr("transform", function () {
                               return "translate(" + (x - 40) + ",0)"
                           });

                           lineSlider.xS = (x - 40);
                           lineSlider.yS = 0;
                           lineSlider.xE = (x - 40);
                           lineSlider.yE = height;
                       }
                   }
               })
               .on("mouseup", function () {
                   if (flag)
                       showPoint(node, lineSlider);

                       flag = false;
               });
}

function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    if (isNaN(x) || isNaN(y)) {
        return false;
    } else {
        if (x1 >= x2) {
            if (!(x2 <= x && x <= x1)) { return false; }
        } else {
            if (!(x1 <= x && x <= x2)) { return false; }
        }
        if (y1 >= y2) {
            if (!(y2 <= y && y <= y1)) { return false; }
        } else {
            if (!(y1 <= y && y <= y2)) { return false; }
        }
        if (x3 >= x4) {
            if (!(x4 <= x && x <= x3)) { return false; }
        } else {
            if (!(x3 <= x && x <= x4)) { return false; }
        }
        if (y3 >= y4) {
            if (!(y4 <= y && y <= y3)) { return false; }
        } else {
            if (!(y3 <= y && y <= y4)) { return false; }
        }
    }
    return true;
}

d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};

d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

function showPoint(node,line) {
    var cout = 0;

    arrayRect.forEach(function (r) {
        d3.select('.' + r).remove();
    })

    arrayText.forEach(function (t) {
        d3.select('.' + t).remove();
    })

    arrayPoint.forEach(function (p) {
        svg.select('.' + p)
                    .style("visibility", "hidden");
    })

    arrFilter.forEach(function (a) {
    
        var result = lineIntersect(line.xS, line.yS, line.xE, line.yE, a.xS, a.yS, a.xE, a.yE);
        
        var name = a.name + "a";

        if (result === true) {
            node.select('.' + a.name).style("visibility", "visible")

            arrayPoint.push(a.name);

            var t = d3.select('.' + name)[0];


            if (t[0] == null && a.rect.y - 2 > 0) {
                if (cout % 2) {
                    var rect = d3.select("svg")
                        .append("rect")
                        .attr("x", 0)
                        .attr("y", a.rect.y + 38)
                        .attr("width", a.rect.width)
                        .attr("height", a.rect.height + 2)
                        .attr("fill", '#9ed3f8')
                        .attr("fill-opacity", 0.4)
                        .attr("class", name);
                }
                else {
                    var rect = d3.select("svg")
                        .append("rect")
                        .attr("x", 0)
                        .attr("y", a.rect.y + 38)
                        .attr("width", a.rect.width)
                        .attr("height", a.rect.height + 2)
                        .attr("fill", '#ffffff')
                        .attr("fill-opacity", 0.4)
                        .attr("class", name);
                }

                arrayRect.push(name);
                d3.select('.' + name).moveToBack();
            }

            if (t[0] == null) {
                svg.append("text")
                    .attr("x", function (d) { return 0 })
                    .attr("y", function (d) { return a.yS })
                    .attr("class", name + '1')
                    .style("user-select", "none")
                    .text(function (d) { return arrayLeters[cout]; });

                arrayText.push(name + '1');
                cout += 1;
            }

        }
    })
}

var tree = d3.layout.tree().size([height - 40, width - 80]);

window.onload = function () {
    addSvgObjtoDOM();
    loadJson("data/tree.json");
}