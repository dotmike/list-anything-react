import UrlInputListField from "../UrlInputListField";

const testData = {
  value: "http://example.com",
  field: { _id: "1", description: "Testando:" },
  newValue: "http://google.com"
};

const setup = (propOverrides = {}) => {
  const props = {
    value: testData.value,
    error: "",
    editable: true,
    showFieldDescription: true,
    field: testData.field,
    onChange: jest.fn(),
    ...propOverrides
  };

  return {
    props,
    wrapperShallow: wrapperShallow(UrlInputListField, props)
  };
};

describe("UrlInputListField", () => {
  describe("when `editable` is true", () => {
    it("renders correctly", () => {
      const { wrapperShallow: wrapper } = setup({
        editable: true
      });
      expect(wrapper()).toMatchSnapshot();
    });

    it("renders correctly when `error` is passed", () => {
      const { wrapperShallow: wrapper } = setup({
        editable: true,
        error: "Something went wrong..."
      });
      expect(wrapper()).toMatchSnapshot();
    });
  });

  describe("when `editable` is false", () => {
    it("renders correctly when `showFieldDescription` is true", () => {
      const { wrapperShallow: wrapper } = setup({
        editable: false,
        showFieldDescription: true
      });
      expect(wrapper()).toMatchSnapshot();
    });

    it("renders correctly when `showFieldDescription` is false", () => {
      const { wrapperShallow: wrapper } = setup({
        editable: false,
        showFieldDescription: false
      });
      expect(wrapper()).toMatchSnapshot();
    });
  });

  it("shoudn't update when `value` prop is changed", () => {
    const spy = jest.spyOn(UrlInputListField.prototype, "render");
    const { wrapperShallow: wrapper } = setup();

    wrapper().setProps({ value: testData.newValue });
    expect(spy).toHaveBeenCalledTimes(1);

    wrapper().setProps({ error: "Something went wrong..." });
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
