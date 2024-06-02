<template>
    <div id="container">
  <div class="doorgroup">
    <a href="#">
      <div class="doorway">
      </div>
    </a>
    <div id='openDoor' class="door">
      <a href="#openDoor" class="no-underline flex items-center">
        go up
      </a>
    </div>
  </div>
</div>
</template>

<style scoped>
#container {
  display: flex;
}

.doorgroup {
  perspective: 200px;
  cursor: pointer;
  display: inline-flex;
}

.doorway {
  border: 5px solid black;
  height: 196px;
  width: 96px;
  overflow: hidden;
  position:relative
}

.door {
  position:absolute;
/*   left:-100px; */
  top:0px;
  height: 200px;
  width: 100px;
  background: brown;
  font-size: 24px;
  background-image: url('http://joeymorello.com/asset_host/door.png');
  border-left: none;
  transition: 600ms transform ease-in-out;
  transform: rotateY(0deg);
  transform-origin: left;
}

.door:target {
  transform: rotateY(35deg);
}
</style>