describe("windows path issue", function(){
  it("returns destFile path properly", function(){
    var Plasma = require("organic").Plasma;
    var path = require("path")
    var SpawnFileCmd = require("../index")
    var instance = new SpawnFileCmd(new Plasma(), {
      "reactOn": "fakeType"
    })
    var result = instance.getDestFile({
      data: {
        path: "D:\\folder\\file.txt"
      },
      root: "D:\\folder",
      dest: "data"
    })  
    expect(result).toBe(path.join(process.cwd(),"data","\\file.txt"))
  })
})