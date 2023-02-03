import Router from "next/router";

export function ServiceErrorHandler(
  target: any,
  propertyName: any,
  descriptor: any
) {
  const method = descriptor.value;
  const className = target.constructor.name;

  descriptor.value = async function (...args: any) {
    try {
      return await method.apply(target, args);
    } catch (error) {
      console.log("error: " + error);
      Router.push("/login");
    }
  };
}
