using NUnit.Framework;

namespace Scorly.Core.Tests
{
    [TestFixture]
    public class TestFramework
    {
        [Test]
        public void IsTrue()
        {
            Assert.That(false, Is.True);
        }

        [Test]
        public void IsFalse()
        {
            Assert.That(false, Is.False);
        }
    }
}
