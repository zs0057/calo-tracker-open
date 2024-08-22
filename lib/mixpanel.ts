import mixpanel from "mixpanel-browser";

mixpanel.init("d3bfa0fbaf36efc0214ad29ea84a25e9");

const env_check: any = process.env.NODE_ENV === "development";

const actions = {
  identify: (id: any) => {
    if (env_check) mixpanel.identify(id);
  },
  alias: (id: any) => {
    if (env_check) mixpanel.alias(id);
  },
  track: (name: any, props: any) => {
    if (env_check) mixpanel.track(name, props);
  },
  people: {
    set: (props: any) => {
      if (env_check) mixpanel.people.set(props);
    },
  },
};

export const Mixpanel = actions;
