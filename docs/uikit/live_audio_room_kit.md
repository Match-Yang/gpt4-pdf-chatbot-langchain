# What is Live Audio Room Kit

`Live Audio Room Kit` is a prebuilt component that helps you to build full-featured live audio rooms into your apps easier. And it includes the business logic along with the UI, enabling you to customize your live audio apps faster with more flexibility. 这是预览效果链接：http://doc.oa.zego.im/Pics/ZegoUIKit/Flutter/audio_room/final_sublist.gif 。如果集成到你的项目可以参考这个链接：https://docs.zegocloud.com/article/15079 。

# 自定义坐席

## 在初始化时为用户指定席位

如果你希望host或者speaker加入语聊房后自动就显示在指定seat上，那么你可以使用`takeSeatIndexWhenJoining`配置项来设置。如果你希望预留一些位置只允许host占用而不允许audience占用，那么你可以使用`hostSeatIndexes`配置项来设置一个坐席index数组，audience就无法申请占用这些seat。

## 定义坐席的布局

`Live Audio Room Kit`席位可以有多行，整体通过`ZegoLiveAudioRoomLayoutConfig`来设置坐席布局，其中的`rowConfigs`参数是一个`List< ZegoLiveAudioRoomLayoutRowConfig >`类型的数组，控制每一行的布局形式；而`rowSpacing`参数则控制每一行之间的间隔（值需要大于0）。
`ZegoLiveAudioRoomLayoutRowConfig`的具体参数如下：
- `ZegoLiveAudioRoomLayoutRowConfig`:
    1. `count`(int): Number of seats in each row, ranging from [1 - 4].
    2. `seatSpacing`(int): Horizontal spacing for each seat, and it must ≥ 0 (this only takes effect when the alignment is `start`, `end`, and `center`).
    3. `alignment`(ZegoLiveAudioRoomLayoutAlignment): The alignment set for the columns.

`ZegoLiveAudioRoomLayoutAlignment`的具体参数如下，每种参数对应的效果预览可以看这个链接（https://storage.zego.im/sdk-doc/Pics/ZegoUIKit/Flutter/audio_room/alignment_1.jpeg）：
- `ZegoLiveAudioRoomLayoutAlignment`:
    1. `start`: Place the seats as close to the start of the main axis as possible.
    2. `end`: Place the seats as close to the end of the main axis as possible.
    3. `center`: Place the seats as close to the middle of the main axis as possible.
    4. `spaceBetween`: Place the free space evenly between the seats.
    5. `spaceAround`: Place the free space evenly between the seats as well as half of that space before and after the first and last seat.
    6. `spaceEvenly`: Place the free space evenly between the seats as well as before and after the first and last seat.

下面我们来做一个自定义布局坐席的简单例子。这个例子中，第一行只有一个seat，用于显示host。然后第2和第3行使用`spaceAround`对齐方式显示，每行显示4个seat。预览效果如图：https://storage.zego.im/sdk-doc/Pics/ZegoUIKit/Flutter/audio_room/custom_layout.jpeg。下面是这个简单例子的代码：

```dart
class LivePage extends StatelessWidget {
  const LivePage({Key? key, required this.roomID, this.isHost = false}) : super(key: key);

  final String roomID;
  final bool isHost;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ZegoUIKitPrebuiltLiveAudioRoom(
        appID: yourAppID,
        appSign: yourAppSign,
        userID: userID,
        userName: userName,
        roomID: roomID,
        config: (isHost
            ? (ZegoUIKitPrebuiltLiveAudioRoomConfig.host()
              ..takeSeatIndexWhenJoining = 0) // 如果是以host身份加入语聊房，那么就占据第一个位置（index为0）
            : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience())
          ..hostSeatIndexes = [0] // 这里我们标记第一个seat被host使用了，其他人无法再使用
          ..layoutConfig.rowConfigs = [
            ZegoLiveAudioRoomLayoutRowConfig(count: 1, alignment: ZegoLiveAudioRoomLayoutAlignment.center),
            ZegoLiveAudioRoomLayoutRowConfig(count: 4, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround),
            ZegoLiveAudioRoomLayoutRowConfig(count: 4, alignment: ZegoLiveAudioRoomLayoutAlignment.spaceAround),
          ],
      ),
    );
  }
}
```

# 更改背景

`Live Audio Room Kit`的默认背景是一个纯色背景，如果你想把这个背景改成其他颜色或者图片，你就可以使用`background`这个配置项来控制。实际上因为`background`要求你提供一个`Widget`，所以你可以在坐席区下面显示任何你想要的内容。比如在下面显示游戏内容、显示别人给你送礼物的动画特效等等。下面一段示例代码演示了如何更改背景为一张图片，这是预览效果（https://storage.zego.im/sdk-doc/Pics/ZegoUIKit/Flutter/audio_room/background.jpeg）：

```dart
class LivePage extends StatelessWidget {
  const LivePage({Key? key, required this.roomID, this.isHost = false}) : super(key: key);
  final String roomID;
  final bool isHost;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ZegoUIKitPrebuiltLiveAudioRoom(
        appID: yourAppID,
        appSign: yourAppSign,
        userID: userID,
        userName: userName,
        roomID: roomID,

        // Modify your custom configurations here.
        config: isHost
            ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host()
            : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()
          ..background = Container(
                decoration: BoxDecoration(
                  image: YourBackgroundImage(),
                ),
            ),
      ),
    );
  }
}
```

# 更改每个seat的样式

By default, the seat's UI displays the user's avatar and sound waves.
If you are not satisfied with the user avatars or sound wave style, or you want to customize the foreground and background, use the following configurations in `seatConfig`:

1. `showSoundWaveInAudioMode`: Use this to decide whether to display the sound waves around the user avatar or not. Displayed by default.
2. `avatarBuilder`: Use this to customize the avatar, and replace the default avatar with it.
3. `foregroundBuilder`: Use this to customize the foreground view of the seat, and the `ZegoUIKitPrebuiltLiveAudioRoom` returns the current user on the seat and the corresponding seat index.
4. `backgroundBuilder`: Use this to customize the background view of the seat, and the `ZegoUIKitPrebuiltLiveAudioRoom` returns the current user on the seat and the corresponding seat index.

## 隐藏seat周围的sound waves

The sound waves are displayed by default, to hide it, use the `showSoundWaveInAudioMode` config. 下面是示例代码：

```dart
ZegoUIKitPrebuiltLiveAudioRoom(
    // ...
    // Modify your custom configurations here.
    config: isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()
        ..seatConfig.showSoundWaveInAudioMode = false,
)
```

## 更改头像

默认情况下，你的用户名的首字母会被当成头像显示。如果你想把头像改成图片或者其他形式（比如3D的模型头像），那么你有两种方式可以实现：使用`avatarBuilder`或者设置`userAvatarUrl`。请注意，如果你用`userAvatarUrl`来设置头像，那么这个URL的长度最长为 64 字节，如果超过了这个限制，就会使用首字母的方式显示。这是更改头像后的预览效果：https://storage.zego.im/sdk-doc/Pics/ZegoUIKit/Flutter/audio_room/custom_avatar.gif。

下面这段代码演示了如何使用`avatarBuilder`来更改头像：
```dart
ZegoUIKitPrebuiltLiveAudioRoom(
        // ...
        // Modify your custom configurations here.
        config: isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()
          ..seatConfig.avatarBuilder = avatarBuilder(BuildContext context, Size size, ZegoUIKitUser? user, Map extraInfo) {
            return CircleAvatar(
              maxRadius: size.width,
              backgroundImage: 'https://your_server/app/avatar/${user.id}.png',
            );
          },
)
```

下面这段代码演示了如何使用`userAvatarUrl`来更改头像：
```dart
ZegoUIKitPrebuiltLiveAudioRoom(
        /// ...
        // Modify your custom configurations here.
        config: isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()
          ///  The userAvatarUrl must be within 64 bytes. If exceeds, the default background is displayed.
          ..userAvatarUrl = 'your_avatar_url'
)
```

## Customize the foreground/background view of the seat

如果你想修改坐席的背景或者前景，比如在背景显示一把椅子，在host或者sepaker头像上挂一个皇冠或者等级标记等等。你就可以通过`seatConfig.foregroundBuilder`和`seatConfig.backgroundBuilder`实现。这是预览效果链接：https://storage.zego.im/sdk-doc/Pics/ZegoUIKit/Flutter/audio_room/custom_bg_fg.gif。

- `foregroundBuilder`: 通过这个属性往seat上添加一个Widget，比如添加一个皇冠或者用户等级图标。
- `backgroundBuilder`: 通过这个属性在seat地下显示一个Widget，比如显示一把椅子。


```dart
ZegoUIKitPrebuiltLiveAudioRoom(
    // ...
    // Modify your custom configurations here.
    config: isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()
        ..seatConfig = (ZegoLiveAudioRoomSeatConfig()
        ..backgroundBuilder = (BuildContext context, Size size, ZegoUIKitUser? user, Map extraInfo) {
            return FireWidget();
        }
        ..foregroundBuilder = (BuildContext context, Size size, ZegoUIKitUser? user, Map extraInfo) {
            return Container(
                    decoration: BoxDecoration(
                      image: CrownIcon(),
                    ),
            )
        }),
)
```

## Customize the bottom menu bar buttons

Live Audio Room Kit (ZegoUIKitPrebuiltLiveAudioRoom) allows you to configure the buttons of the menu bar. You can remove the default buttons or add custom ones. If necessary, you can configure the `bottomMenuBarConfig`:

1. `hostButtons`: Use this to set the prebuilt-in buttons for a host to use. 
2. `speakerButtons `: Use this to set the prebuilt-in buttons for a speaker to use.
3. `audienceButtons `: Use this to set the prebuilt-in buttons for the audience to use.
4. `hostExtendButtons`: Use this to set the custom buttons for a host to use.
5. `speakerExtendButtons`: Use this to set the custom buttons for a speaker to use.
6. `audienceExtendButtons `: Use this to set the custom buttons for the audience to use.
7. `maxCount`: Maximum number of buttons that can be displayed by the menu bar. Value range [1 - 5], the default value is 5.
8. `showInRoomMessageButton`: Whether to display the message button, displayed by default.

If the total number of built-in buttons and custom buttons does not exceed the `maxCount`, all buttons will be displayed.
Otherwise, other buttons that cannot be displayed will be hidden in the three dots (⋮) button. Clicking this button will pop up the bottom sheet to display the remaining buttons.
这是自定义底部菜单栏按钮的预览效果：https://storage.zego.im/sdk-doc/Pics/ZegoUIKit/Flutter/audio_room/bottom_bar.gif。

下面是修改底部按钮的示例代码：

```dart
ZegoUIKitPrebuiltLiveAudioRoom(
    // ...
    // Modify your custom configurations here.
    config: isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()
      ..bottomMenuBarConfig = ZegoBottomMenuBarConfig(
        maxCount: 5,
        hostButtons: [
          ZegoMenuBarButtonName.toggleMicrophoneButton,
          ZegoMenuBarButtonName.showMemberListButton,
        ],
        hostExtendButtons: [
          ElevatedButton(
              onPressed: () {},
              child: Icon(Icons.cookie),
          ),
        ],
        speakerButtons: [
          ZegoMenuBarButtonName.toggleMicrophoneButton,
          ZegoMenuBarButtonName.showMemberListButton,
        ],
    ),
)
```
# Set a leave confirmation dialog

`Live Audio Room Kit`默认在用户点击离开语聊房按钮或者Android系统的返回键时会直接退出语聊房。如果你想在用户退出语聊房前可以给用户弹框确认是否要离开语聊房，你可以通过`confirmDialogInfo`参数来设置。
这是使用confirmDialogInfo的预览效果链接：(https://storage.zego.im/sdk-doc/Pics/ZegoUIKit/Flutter/audio_room/leave_confirmation.gif)。下面是示例代码：


```dart
ZegoUIKitPrebuiltLiveAudioRoom(
      // ...
      // Modify your custom configurations here.
      config: isHost ? (ZegoUIKitPrebuiltLiveAudioRoomConfig.host()
            ..confirmDialogInfo = ZegoDialogInfo(
              title: "Leave the room",
              message: "Are you sure to leave the room?",
              cancelButtonName: "Cancel",
              confirmButtonName: "Leave",
            ))
          : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience(),
)
```


如果你希望在退出语聊房前不仅仅弹一个简单的对话框，而是需要做更多复杂的业务逻辑，比如向后台更新一些记录，那么你可以通过`onLeaveConfirmation`参数来设置。这个参数要求你提供一个方法，该方法需要返回一个异步结果。这是使用`onLeaveConfirmation`后的预览效果链接：(https://storage.zego.im/sdk-doc/Pics/ZegoUIKit/Flutter/audio_room/custom_confirm.gif)。下面是示例代码:

```dart
ZegoUIKitPrebuiltLiveAudioRoom(
    // ...
    // Modify your custom configurations here.
    config: isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()
      ..onLeaveConfirmation = (BuildContext context) async {
        // 向服务器请求更新操作等业务逻辑代 
        return await showDialog(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) {
              return AlertDialog(
                title: const Text("This is your custom dialog"),
                content: const Text("You can customize this dialog however you like"),
                actions: [
                  ElevatedButton(
                    child: const Text("Cancel"),
                    onPressed: () => Navigator.of(context).pop(false),
                  ),
                  ElevatedButton(
                    child: const Text("Exit"),
                    onPressed: () => Navigator.of(context).pop(true),
                  ),
                ],
              );
          },
        );
      }
)
```

# 修改成员列表上更多菜单按钮(⋮) 的点击逻辑

目前成员列表上更多按钮提供了邀请观众上麦和静音某个spekaer的功能。如果你还想在点击这个更多按钮时做更多操作，比如查看这个成员的profile、禁止某个人问题聊天或者将这个人移除出房间，那么你就可以通过设置`onMemberListMoreButtonPressed`回调监听按钮按下的动作然后弹出你自己的菜单，在你的菜单中添加查看profile等功能。请注意，一旦你设置了`onMemberListMoreButtonPressed`回调，那么原来该按钮提供的默认功能（比如邀请上麦和静音）等功能就需要你自己重现在你自定义的菜单里调用接口实现了。`onMemberListMoreButtonPressed`回调提供了一个`user`参数，这个参数对应的就是你按下更多按钮那一个人的信息。这是预览效果链接：https://storage.zego.im/sdk-doc/Pics/ZegoUIKit/Flutter/audio_room/member_more_custom.gif。以下是一个简单的示例代码：

```dart
ZegoUIKitPrebuiltLiveAudioRoom(
        // ...
        // Modify your custom configurations here.
        config: isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()

          /// WARNING: will override prebuilt logic
          ..onMemberListMoreButtonPressed = (ZegoUIKitUser user) {
            showYourOwnMenuWithYourOwnActions(context, user);
          },
)
```

# Customize the menu item of the clicked seat

如果你希望在点击seat时可以显示对seat上speaker或者host的profile，或者你想通过点击某个seat给对应的人送礼。你可以通过设置`onSeatClicked`回调来监听seat被点击的动作然后弹出你自己的菜单，在你的菜单中添加查看profile等功能。请注意，一旦你设置了`onSeatClicked`回调，那么原来点击事件默认功能（比如将speaker移出坐席）等功能就需要你自己重现在你自定义的菜单里调用接口实现了。`onSeatClicked`提供了一个`index` 和 `user` 参数，`index`表示这个被点击的坐席是第几个位置，`user`表示这个坐席上的人的信息。这是效果预览链接：https://storage.zego.im/sdk-doc/Pics/ZegoUIKit/Flutter/audio_room/seat_click_custom.gif 。以下是示例代码：
```dart
ZegoUIKitPrebuiltLiveAudioRoom(
        // ...
        // Modify your custom configurations here.
        config: isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()

          /// WARNING: will override prebuilt logic
          ..onSeatClicked = (int index, ZegoUIKitUser? user) {
            showYourOwnMenuWithYourOwnActions(context, user);
          },
)
```

# Customize the message list item

如果你想更改当前消息列表的样式（比如背景颜色、透明度、圆角），或者增加额外信息（比如发消息这个人的等级、他的身份）等等，那么你都可以通过`ZegoUIKitPrebuiltLiveAudioRoomConfig.inRoomMessageViewConfig.itemBuilder`来实现。`itemBuilter`会要求你返回一个`Widget`。当这个列表有更新重新绘制的时候，你提供的`itemBuilter`方法就会被调用并且你返回的`Widget`就会被绘制到消息列表中。`itemBuilter`提供了一个`ZegoInRoomMessage`类型的参数`message`。这个`ZegoInRoomMessage`定义如下：
```dart
class ZegoInRoomMessage {
  int messageID;
  ZegoUIKitUser user; // message sender.
  String message; // message content.
  int timestamp; // The timestamp at which the message was sent
  var state = ValueNotifier<ZegoInRoomMessageState>(ZegoInRoomMessageState.success); // message sending state.
}
```
以下是使用`itemBuilder`来自定义消息列表项的示例代码：
```dart
ZegoUIKitPrebuiltLiveAudioRoom(
    // ...
    // Modify your custom configurations here.
    config: isHost
        ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host()
        : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()
      ..inRoomMessageViewConfig = ZegoInRoomMessageViewConfig(
        itemBuilder: (BuildContext context, ZegoInRoomMessage message, Map<String, dynamic> extraInfo,) {
          /// how to use itemBuilder to custom message view
          return Text('${message.user.name} : ${message.message}');
        },
      ),
    )
```

# Modify User Interface text

Live Audio Room Kit (ZegoUIKitPrebuiltLiveAudioRoom)'s UI text provided by the internal components is editable, to modify those, use the `ZegoInnerText `config. 比如你想把UI上的某个单词换掉，或者你想把UI上的文字改成其他语言。以下是使用`ZegoInnerText`修改UI上文字的示例代码：
```dart
ZegoUIKitPrebuiltLiveAudioRoom(
        // ...
        // Modify your custom configurations here.
        config: isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()
          ..innerText.memberListTitle = 'Members',
)
```

# Customize user attributes

在用户进入语聊房时你可能需要记录一些用户的信息，比如这个用户的等级、他拥有的金币数量等等，你都可以通过`userInRoomAttributes`参数设置。当这个用户进入语聊房后，其他人就会收到`onUserCountOrPropertyChanged`回调，那这样其他人也能读取到这个用户的这些额外信息。The user attribute (userInRoomAttributes) is in the format of key-value pairs. For a single user, the sum of all Key-Value pairs must be within 100 bytes and a maximum of 20 pairs can be configured.Each Key must be within 8 bytes.Each Value must be within 64 bytes. 以下是示例代码：
```dart
ZegoUIKitPrebuiltLiveAudioRoom(
        // ...
        // Modify your custom configurations here.
        config: isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()
          ..userInRoomAttributes = {
            'key_1': 'value_1',
          },
)
```

# Minimize audio room window

最小化窗口效果就是在你不退出语聊房的情况下，可以将语聊房窗口变成一个可以在app内拖动的小窗口。这个时候你可以在保持说话或者听别人说话的情况下操作app的其他功能，比如查看用户信息，查看账单等等。如果你要实现窗口最小化的效果，那么你有3个步骤需要完成。第一步是将`ZegoTopMenuBarButtonName.minimizingButton`添加到`topMenuBarConfig.buttons`中（当然添加到bottomMenuBarConfig.buttons中也可以的）；第二步是在`MaterialApp`的`builder`方法中将`ZegoUIKitPrebuiltLiveAudioRoomMiniOverlayPage`组件插入`Stack`的children中返回。第三步是通过判断`ZegoUIKitPrebuiltLiveAudioRoomMiniOverlayMachine().isMinimizing`是否为`true`防止在没退出语聊房的情况下重复加入语聊房。

下面的代码演示了如何将`ZegoTopMenuBarButtonName.minimizingButton`添加到`ZegoUIKitPrebuiltLiveAudioRoomConfig`的`topMenuBarConfig.buttons`配置项中：
```dart
ZegoUIKitPrebuiltLiveAudioRoom(
    // ...
    // Modify your custom configurations here.
    config: isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()
      ..topMenuBarConfig.buttons = [
        ZegoTopMenuBarButtonName.minimizingButton
    ],
)
```

下面代码演示了如何将`ZegoUIKitPrebuiltLiveAudioRoomMiniOverlayPage`组件插入`MaterialApp`的children中：
```dart
///  Step 1/3: Declare a NavigatorState
final navigatorKey = GlobalKey<NavigatorState>();

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      /// Step 2/3: Assign the NavigatorState to MaterialApp
      navigatorKey: navigatorKey,
      builder: (BuildContext context, Widget? child) {
        return Stack(
          children: [
            child!,
            ///  Step 3/3: Insert ZegoUIKitPrebuiltLiveAudioRoomMiniOverlayPage into Overlay, and return the context of NavigatorState in contextQuery.
            ZegoUIKitPrebuiltLiveAudioRoomMiniOverlayPage(
              contextQuery: () {
                return navigatorKey.currentState!.context;
              },
            ),
          ],
        );
      },
    );
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  ZegoUIKit().initLog().then((value) {
    runApp(const MyApp());
  });
}
```

下面代码演示了如何防止重复加入语聊房：
```dart
ElevatedButton(
  onPressed: () {
    if (ZegoUIKitPrebuiltLiveAudioRoomMiniOverlayMachine().isMinimizing) {
      /// When the application is minimized (in a minimized state),
      /// Disable button clicks to prevent multiple ZegoUIKitPrebuiltLiveAudioRoom components from being created.
      return;
    }

    /// The code you used to initialize or navigate ZegoUIKitPrebuiltLiveAudioRoom previously
    Navigator.pushNamed(
      context,
      ZegoUIKitPrebuiltLiveAudioRoom(...),
    );
  },
  child: const Text('join'),
);
```


# Customize your own business logic

`Live Audio Room Kit` 通过`controller` 提供了一些方法让你可以调用，以便你可以使用这些方法写出更贴近你业务需求的逻辑实现.

以下这些是`controller` 对外提供的接口：

- `leaveSeat`({bool showDialog = true}): Voluntarily leave a seat. A pop-up confirmation prompt will show when the `showDialog` is `true`.
- `removeSpeakerFromSeat`(String userID): Remove the speaker from the seat.
- `closeSeats`: Close an open speaker seat, once it is closed, the audience can only take the seat by inviting by the host or sending a seat-taking request.
- `openSeats`: Open a closed seat, once it is opened, the audience can take the seat by clicking it.
- `applyToTakeSeat`: The audience applies to take a speaker seat.
- `cancelSeatTakingRequest`: The audience cancels his seat-taking request.
- `acceptSeatTakingRequest`(String audienceUserID): The host accepts the audience's seat-taking request.
- `rejectSeatTakingRequest`(String audienceUserID): The host rejects the audience's seat-taking request.
- `inviteAudienceToTakeSeat`(String userID): The host invites the audience to take a speaker seat.
- `acceptHostTakeSeatInvitation`: The audience accepts the seat-taking invite from the host.

以下示例代码演示了在点击坐席时马上使用`controller`将speaker移出坐席：
```dart
class _LivePageState extends State<LivePage> {
  final controller = ZegoLiveAudioRoomController();

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ZegoUIKitPrebuiltLiveAudioRoom(
        // ...
        config: (widget.isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience())
                ..onSeatClicked = (int index, ZegoUIKitUser? user) {
                    if (userIsHost(user)) return;
                    controller.removeSpeakerFromSeat(user.userID);
                },
        ///  Assign the controller you defined to this parameter.
        controller: controller,
      ),
    );
  }
}
```

`Live Audio Room Kit` 提供了一系列的状态和事件回调方法使你可以做更多符合你业务逻辑的操作，以下是支持的回调方法：

- Function(ZegoUIKitUser user)? `onMemberListMoreButtonPressed`: This callback will be triggered when the more button in the member list is pressed. 
- Function(int index, ZegoUIKitUser? user) `onSeatClicked`: This callback will be triggered when a seat is clicked. 
- Function() `onSeatClosed`: This callback will be triggered when a speaker seat is closed. 
- Function() `onSeatsOpened`: This callback will be triggered when a closed speaker seat is opened. 
- Function(Map<int/*seat index*/, ZegoUIKitUser> takenSeats, List<int> untakenSeats) `onSeatsChanged`: This callback will be triggered when someone gets on/gets off/switches seat. 
- Function(ZegoUIKitUser audience) `onSeatTakingRequested`: The host will receive a notification via this callback when the audience applies to take a seat.

- Function(ZegoUIKitUser audience) `onSeatTakingRequestCanceled`: The host will receive a notification via this callback when the audience cancels his seat-taking request.
- VoidCallback? `onInviteAudienceToTakeSeatFailed`: The host will receive a notification via this callback when a seat-taking invite failed.
- VoidCallback? `onSeatTakingInviteRejected`: The host will receive a notification via this callback when the audience rejects the seat-taking invite.  
- VoidCallback? `onSeatTakingRequestFailed`: The audience will receive a notification via this callback when his seat-taking request fails.
- VoidCallback? `onSeatTakingRequestRejected`: The audience will receive a notification via this callback when his seat-taking request is rejected by the host.
- VoidCallback? `onHostSeatTakingInviteSent`: The audience will receive a notification via this callback when the host invites them to take a seat.

请注意：The `onSeatClicked` and `onMemberListMoreButtonPressed` overrides Live Audio Room Kit's prebuilt logic, meaning that when you customize these events, the prebuilt events are no longer executed.

以下是如何使用回调方法的示例代码：
```dart
ZegoUIKitPrebuiltLiveAudioRoom(
    // ...
    // Modify your custom configurations here.
    config: isHost ? ZegoUIKitPrebuiltLiveAudioRoomConfig.host() : ZegoUIKitPrebuiltLiveAudioRoomConfig.audience()
            ..onSeatClosed = () {
                // Seat is closed
            }
)
```