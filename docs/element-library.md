# Element Library Documentation

The Content-to-Experience Converter provides a rich set of interactive elements that can be used to transform static content into engaging experiences. This document outlines each element's capabilities, properties, and platform compatibility.

## Basic Elements

### Quiz Question

Transform content into an interactive learning experience with quiz questions.

#### Properties:

- **Question Text**: The main question to ask users
- **Question Type**: 
  - Multiple choice (single answer)
  - Multiple choice (multiple answers)
  - True/False
  - Short answer
- **Options**: Answer choices (for multiple choice questions)
- **Correct Answer**: Defines which answer(s) are correct
- **Feedback**: Custom responses for correct/incorrect answers
- **Show Results**: Toggle whether to show if answer was correct
- **Point Value**: Optional point value for scoring

#### Example Usage:

```javascript
{
  "type": "quiz",
  "properties": {
    "questionText": "Which of these features is most important to you?",
    "questionType": "multiple-choice-single",
    "options": [
      "Ease of use", 
      "Performance", 
      "Price", 
      "Customer support"
    ],
    "correctAnswer": 1, // Index of correct answer (optional)
    "feedback": {
      "correct": "Great choice!",
      "incorrect": "Consider the benefits of performance."
    },
    "showResults": true,
    "pointValue": 10
  }
}
```

#### Platform Compatibility:

- Website: Full support
- Instagram: Not supported
- Email: Limited support (static fallback)
- LinkedIn: Not supported

---

### Poll

Gather user opinions with interactive polls.

#### Properties:

- **Question Text**: The poll question
- **Options**: Poll choices
- **Multiple Selection**: Allow users to select multiple options
- **Show Results**: Toggle real-time results display
- **Results Display**: How to visualize results (bar chart, pie chart, etc.)
- **Expiration**: Optional time limit for the poll

#### Example Usage:

```javascript
{
  "type": "poll",
  "properties": {
    "questionText": "What content format do you prefer?",
    "options": [
      "Blog posts", 
      "Videos", 
      "Infographics", 
      "Podcasts"
    ],
    "multipleSelection": false,
    "showResults": true,
    "resultsDisplay": "bar-chart",
    "expiration": null // No expiration
  }
}
```

#### Platform Compatibility:

- Website: Full support
- Instagram: Partial support (story polls only)
- Email: Not supported
- LinkedIn: Partial support (post polls only)

---

### Image Gallery

Present multiple images in an interactive gallery format.

#### Properties:

- **Images**: Array of image objects (URL, caption, alt text)
- **Display Type**: 
  - Carousel
  - Grid
  - Slideshow
  - Before/After comparison
- **Navigation**: Options for navigating through images
- **Captions**: Toggle display of image captions
- **Lightbox**: Enable/disable lightbox view on click
- **Autoplay**: Toggle and configure autoplay settings

#### Example Usage:

```javascript
{
  "type": "imageGallery",
  "properties": {
    "images": [
      {
        "url": "images/product-front.jpg",
        "caption": "Front view",
        "alt": "Product front view showing main features"
      },
      {
        "url": "images/product-side.jpg",
        "caption": "Side view",
        "alt": "Product side view with ports visible"
      }
    ],
    "displayType": "carousel",
    "navigation": "arrows",
    "showCaptions": true,
    "enableLightbox": true,
    "autoplay": {
      "enabled": true,
      "interval": 3000, // 3 seconds
      "pauseOnHover": true
    }
  }
}
```

#### Platform Compatibility:

- Website: Full support
- Instagram: Partial support (static carousel)
- Email: Limited support (static images)
- LinkedIn: Partial support (single image view)

---

### Video Player

Embed and customize video playback with interactive features.

#### Properties:

- **Video Source**: URL or file reference
- **Poster Image**: Thumbnail displayed before playback
- **Controls**: Toggle and customize player controls
- **Autoplay**: Enable/disable autoplay
- **Loop**: Enable/disable looping
- **Interactive Timeline**: Add clickable points on the video timeline
- **Chapters**: Define video chapters for navigation
- **Transcripts**: Toggle and provide video transcripts

#### Example Usage:

```javascript
{
  "type": "videoPlayer",
  "properties": {
    "videoSource": "videos/product-demo.mp4",
    "posterImage": "images/video-thumbnail.jpg",
    "showControls": true,
    "autoplay": false,
    "loop": false,
    "interactiveTimeline": [
      {
        "time": 15, // 15 seconds
        "label": "Feature Highlight",
        "action": "showTooltip",
        "content": "Note how this feature saves time"
      }
    ],
    "chapters": [
      {
        "time": 0,
        "title": "Introduction"
      },
      {
        "time": 45,
        "title": "Key Features"
      }
    ],
    "transcript": {
      "show": true,
      "text": "In this video, we demonstrate how our product works..."
    }
  }
}
```

#### Platform Compatibility:

- Website: Full support
- Instagram: Limited support (basic video only)
- Email: Not supported (static image fallback)
- LinkedIn: Partial support (basic video only)

## Advanced Elements

### Timeline

Create interactive chronological displays of events or steps.

#### Properties:

- **Orientation**: Horizontal or vertical
- **Events**: Array of timeline events (date, title, description, media)
- **Navigation**: Options for timeline navigation
- **Zoom Levels**: Configure zoom levels for detailed exploration
- **Auto Scroll**: Toggle and configure automatic scrolling
- **Style**: Visual styling options

#### Example Usage:

```javascript
{
  "type": "timeline",
  "properties": {
    "orientation": "horizontal",
    "events": [
      {
        "date": "2020-01",
        "title": "Product Concept",
        "description": "Initial concept development",
        "media": {
          "type": "image",
          "url": "images/concept.jpg"
        }
      },
      {
        "date": "2020-06",
        "title": "Beta Launch",
        "description": "First beta release to testers",
        "media": {
          "type": "video",
          "url": "videos/beta-launch.mp4"
        }
      }
    ],
    "navigation": "arrows",
    "zoomLevels": ["year", "month"],
    "autoScroll": {
      "enabled": false
    },
    "style": "modern"
  }
}
```

#### Platform Compatibility:

- Website: Full support
- Instagram: Not supported
- Email: Not supported
- LinkedIn: Not supported

---

### Tooltips

Add contextual information that appears on hover or click.

#### Properties:

- **Trigger**: What activates the tooltip (hover, click)
- **Position**: Where the tooltip appears relative to the trigger
- **Content**: Text, images, or HTML for the tooltip
- **Style**: Visual styling options
- **Animation**: Entrance and exit animations
- **Persistent**: Toggle whether tooltip stays open until dismissed

#### Example Usage:

```javascript
{
  "type": "tooltip",
  "properties": {
    "trigger": "hover",
    "position": "top",
    "content": {
      "text": "This feature saves an average of 30 minutes per day",
      "image": "images/time-saving.jpg"
    },
    "style": "light",
    "animation": "fade",
    "persistent": false
  }
}
```

#### Platform Compatibility:

- Website: Full support
- Instagram: Not supported
- Email: Not supported
- LinkedIn: Not supported

---

### Filters

Allow users to filter or sort content dynamically.

#### Properties:

- **Filter Categories**: Array of filtering options
- **Filter Type**: Single or multiple selection
- **Default Filters**: Pre-selected filters on load
- **Filter Logic**: AND/OR logic between filters
- **Animation**: Transition animation for filtered items
- **Counter**: Toggle display of result counts

#### Example Usage:

```javascript
{
  "type": "filters",
  "properties": {
    "filterCategories": [
      {
        "name": "Category",
        "options": ["Software", "Hardware", "Services"]
      },
      {
        "name": "Price Range",
        "options": ["Under $50", "$50-$100", "Over $100"]
      }
    ],
    "filterType": "multiple",
    "defaultFilters": ["Software"],
    "filterLogic": "AND",
    "animation": "fade",
    "showCounter": true
  }
}
```

#### Platform Compatibility:

- Website: Full support
- Instagram: Not supported
- Email: Not supported
- LinkedIn: Not supported

---

### Hot Spots

Create clickable regions that reveal additional information or trigger actions.

#### Properties:

- **Position**: X/Y coordinates of the hot spot
- **Icon**: Visual indicator for the hot spot
- **Content**: What appears when the hot spot is activated
- **Trigger**: Click or hover activation
- **Content Display**: How content appears (tooltip, modal, etc.)
- **Animation**: Entry animation for the hot spot

#### Example Usage:

```javascript
{
  "type": "hotspot",
  "properties": {
    "position": {
      "x": 150,
      "y": 230
    },
    "icon": "plus",
    "content": {
      "title": "Power Button",
      "description": "Press and hold for 3 seconds to turn on",
      "image": "images/power-instructions.jpg"
    },
    "trigger": "click",
    "contentDisplay": "tooltip",
    "animation": "pulse"
  }
}
```

#### Platform Compatibility:

- Website: Full support
- Instagram: Not supported
- Email: Not supported
- LinkedIn: Not supported

## Templates

### Product Tour

A guided experience showcasing product features with tooltips and interactions.

#### Components:

- Sequential tooltips highlighting different features
- Navigation controls (next/previous)
- Progress indicator
- Optional product rotation or zoom interactions

#### Example Usage:

```javascript
{
  "type": "template",
  "template": "productTour",
  "properties": {
    "productImage": "images/product-main.jpg",
    "features": [
      {
        "position": { "x": 120, "y": 80 },
        "title": "Control Panel",
        "description": "Intuitive touch controls"
      },
      {
        "position": { "x": 250, "y": 150 },
        "title": "LED Display",
        "description": "High-contrast screen visible in any lighting"
      }
    ],
    "showProgress": true,
    "enableRotation": true
  }
}
```

#### Platform Compatibility:

- Website: Full support
- Instagram: Not supported
- Email: Not supported
- LinkedIn: Not supported

---

### Interactive Story

A branching narrative experience where user choices affect the story path.

#### Components:

- Story segments with text and media
- Decision points with multiple options
- Path tracking and visualization
- Results or endings based on choices

#### Example Usage:

```javascript
{
  "type": "template",
  "template": "interactiveStory",
  "properties": {
    "startSegment": "intro",
    "segments": {
      "intro": {
        "content": "You're faced with a challenging customer issue...",
        "image": "images/customer-service.jpg",
        "choices": [
          {
            "text": "Offer an immediate refund",
            "nextSegment": "refund"
          },
          {
            "text": "Investigate the issue further",
            "nextSegment": "investigate"
          }
        ]
      },
      "refund": {
        "content": "The customer appreciates your quick response...",
        "choices": [...]
      },
      "investigate": {
        "content": "You discover the issue is due to...",
        "choices": [...]
      }
    },
    "showPathVisualization": true
  }
}
```

#### Platform Compatibility:

- Website: Full support
- Instagram: Not supported
- Email: Not supported
- LinkedIn: Not supported

---

### Clickable Infographic

A visual data representation with interactive elements for deeper information.

#### Components:

- Base infographic image
- Clickable regions revealing additional data
- Data visualizations (charts, counters)
- Optional zoom/pan for detailed exploration

#### Example Usage:

```javascript
{
  "type": "template",
  "template": "clickableInfographic",
  "properties": {
    "baseImage": "images/market-share-infographic.jpg",
    "clickableRegions": [
      {
        "area": { "x": 100, "y": 150, "width": 200, "height": 100 },
        "title": "North America Market",
        "content": {
          "text": "North America represents 45% of global sales",
          "chart": {
            "type": "pie",
            "data": [...]
          }
        }
      }
    ],
    "enableZoom": true,
    "showLegend": true
  }
}
```

#### Platform Compatibility:

- Website: Full support
- Instagram: Limited support (static image only)
- Email: Limited support (static image only)
- LinkedIn: Limited support (static image only)

## Platform-Specific Considerations

### Website

- Supports all interactive elements
- Best platform for complex interactive experiences
- Consider performance on different devices and browsers

### Instagram

- Limited to simple interactions
- Focus on visual elements
- Ensure essential information is visible without interaction
- Consider Stories vs. Feed format limitations

### Email

- Most email clients block JavaScript
- Rely on animated GIFs for simple animation
- Provide fallback static content for all interactive elements
- Test across major email clients

### LinkedIn

- Limited interactive support
- Focus on document embeds and polls
- Consider professional context and format
- Ensure desktop and mobile compatibility

## Best Practices

1. **Start Simple**: Begin with basic interactive elements before trying complex templates
2. **Consider Accessibility**: Ensure interactive elements are keyboard navigable and screen reader friendly
3. **Performance First**: Large or numerous interactive elements can slow down loading times
4. **Progressive Enhancement**: Design so content is valuable even if interactivity fails
5. **Cross-Platform Testing**: Always test how your interactive elements behave across target platforms