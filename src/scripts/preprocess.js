import { values } from "d3";

let data = [];

export function setData(newData) {
  data = newData
  console.log(data)
}

export function getData() {
  return [...data];
}