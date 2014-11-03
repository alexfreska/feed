(function () {
    var converter = new Showdown.converter();

    var CommentBox = React.createClass({
        loadCommentsFromServer: function () {
            $.ajax({
                url: this.props.url,
                dataType: 'json',
                success: function (data) {
                    this.setState(data);
                }.bind(this),
                error: function(xhr, status, error) {
                    console.error(this.props.url, status, error.toString());
                }.bind(this)
            });
        },

        getInitialState: function () {
            return {data: []};
        },
        componentDidMount: function () {
            this.loadCommentsFromServer();

            // Use sockets.io here instead of polling
            setInterval(this.loadCommentsFromServer, this.props.pollInterval);
        },
        render: function () {
            return (
                <div className="commentBox">
                    <h1>Comments</h1>
                    <CommentList data={this.props.data}/>
                    <CommentForm />
                </div>
            );
        }
    });

    var CommentList = React.createClass({
        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.author} />
                    {comment.text}
                </Comment>
            );
        });
        render: function () {
            return (
                <div className="commentList">
                    {commentNodes}
                </div>
            );
        }
    });

    var CommentForm = React.createClass({
        render: function () {
            return (
                <div className="commentForm">
                    I am a comment form.
                </div>
            );
        }
    });

    var Comment = React.createClass({
        render: function () {
            var rawMarkup = converter.makeHtml(this.props.children.toString());

            return (
                <div className="comment">
                    <h2 className="commentAuthor">
                        {this.props.author}
                    </h2>
                    <span dangerouslySetInnerHtml={{__html: rawMarkup}}
                </div>
            );
        }
    });

    React.render(
        <CommentBox url={_example.json} pollInterval={2000} />,
        document.getElementById('content')
    );
})();
