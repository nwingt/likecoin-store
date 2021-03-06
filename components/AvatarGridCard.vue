<template>
  <div class="avatar-grid-card">
    <div>

      <img v-lazy="avatar">
      <h1>{{ title }}</h1>
      <h2>{{ subtitle }}</h2>
      <p
        class="description"
        v-html="description"
      />

      <div
        v-if="platforms"
        class="platforms"
      >
        <div
          v-for="{ key, to, isInternal } in platforms"
          :key="key"
          class="platform"
        >

          <nuxt-link
            v-if="isInternal"
            :to="to"
          >
            <md-button class="md-icon-button">
              <img
                :alt="key"
                :src="imgUrl(`icons/${key}-dark.svg`)"
              >
            </md-button>
          </nuxt-link>

          <md-button
            v-else
            :href="to"
            class="md-icon-button"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              :alt="key"
              :src="imgUrl(`icons/${key}-dark.svg`)"
            >
          </md-button>

        </div>
      </div>
    </div>
  </div>
</template>


<script>
const images = require.context('../assets/');
const imgUrl = path => images(`./${path}`);


export default {
  name: 'avatar-grid-card',
  props: {
    avatar: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    platforms: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    imgUrl,
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.avatar-grid-card {
  width: 100%;
  height: 100%;
  margin: auto;

  > div {
    width: inherit;
    height: inherit;
    padding: 18px 8px 32px;

    border-radius: 6px;

    background-color: white;

    > * {
      display: block;
    }

    img {
      width: 112px;
      height: 112px;
      margin: auto;

      border-radius: 50%;

      & + * {
        margin-top: 16px;
      }
    }

    h1 {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.35;
    }

    h2 {
      color: $like-gray-4;

      font-size: 16px;
      font-weight: 300;
      line-height: 1.375;
    }

    h1,
    h2 {
      text-align: center;
    }

    .description {
      margin-top: 4px;

      text-align: center;

      color: $like-gray-4;

      font-size: 14px;
      font-weight: 300;

      /deep/ a {
        &,
        &:active {
          text-decoration: underline;

          color: $like-green;
        }
      }
    }

    a,
    a:active {
      text-decoration: underline;

      color: $like-green;
    }

    .platforms {
      text-align: center;

      .platform {
        display: inline-block;
      }

      .md-button {
        margin: 0;

        &:hover {
          opacity: .7;
        }

        /deep/ .md-ripple {
          padding: 0 6px;
        }
      }
    }
  }
}
</style>
